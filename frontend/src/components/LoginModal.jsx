import { useState, useEffect, useRef } from "react";
import {
  FaPhoneAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";
import "../styles/loginmodal.css";

function LoginModal({ closeModal, setToken }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const otpRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Auto-dismiss messages after 4 seconds
  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(""), 4000);
      return () => clearTimeout(t);
    }
  }, [success]);

  // Focus first OTP input when step changes to 2
  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);
    const focusIndex = Math.min(pastedData.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const getOtpString = () => otp.join("");

  const handleSendOtp = async () => {
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to send verification code. Please try again.");
        return;
      }

      setSuccess("Verification code sent successfully!");
      setStep(2);
      setTimer(30);
    } catch {
      setError("Network error. Please check your connection and retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = getOtpString();
    if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpString }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid code. Please check and try again.");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setStep(3);
    } catch {
      setError("Verification failed. Please ensure you're connected to the internet.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    handleSendOtp();
  };

  const timerPercentage = (timer / 30) * 100;

  // Auto-close after reaching step 3 (success screen)
  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => closeModal(), 3000);
      return () => clearTimeout(t);
    }
  }, [step, closeModal]);

  return (
    <div className="lm-overlay" onClick={closeModal}>
      <div className="lm-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="lm-close" onClick={closeModal} aria-label="Close">
          <FaTimes />
        </button>

        {/* Decorative accent bar */}
        <div className="lm-accent-bar"></div>

        {/* Step Indicator */}
        <div className="lm-steps">
          <div className={`lm-step-dot ${step >= 1 ? "active" : ""}`}>
            <span>1</span>
          </div>
          <div className={`lm-step-line ${step >= 2 ? "active" : ""}`}></div>
          <div className={`lm-step-dot ${step >= 2 ? "active" : ""}`}>
            <span>2</span>
          </div>
          <div className={`lm-step-line ${step >= 3 ? "active" : ""}`}></div>
          <div className={`lm-step-dot ${step >= 3 ? "active" : ""}`}>
            <span>✓</span>
          </div>
        </div>

        {/* Body */}
        <div className="lm-body">
          {/* Messages */}
          {error && (
            <div className="lm-msg lm-msg-error">
              <FaExclamationTriangle className="lm-msg-icon" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="lm-msg lm-msg-success">
              <FaCheckCircle className="lm-msg-icon" />
              <span>{success}</span>
            </div>
          )}

          {step === 3 ? (
            /* ---- STEP 3: SUCCESS SCREEN ---- */
            <div className="lm-success-screen">
              <div className="lm-success-circle">
                <svg className="lm-checkmark" viewBox="0 0 52 52">
                  <circle className="lm-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="lm-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <h2>Login Successful!</h2>
              <p>Welcome to Toffee Table. You're all set.</p>
              <button className="lm-btn" onClick={closeModal}>
                <span>Continue</span>
                <FaArrowRight className="lm-btn-arrow" />
              </button>
              <span className="lm-auto-close">Closing automatically in a moment…</span>
            </div>
          ) : step === 1 ? (
            <>
              {/* Step 1 Header */}
              <div className="lm-header">
                <div className="lm-icon-circle">
                  <FaPhoneAlt />
                </div>
                <h2>Welcome Back</h2>
                <p>Enter your mobile number to receive a one-time verification code.</p>
              </div>

              {/* Step 1 Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendOtp();
                }}
              >
                <div className="lm-field">
                  <label htmlFor="lm-phone">Mobile Number</label>
                  <div className="lm-input-wrap">
                    <span className="lm-prefix">+91</span>
                    <input
                      id="lm-phone"
                      type="tel"
                      placeholder="Enter your number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      maxLength="10"
                      autoFocus
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="lm-btn" disabled={loading}>
                  <span>{loading ? "Sending…" : "Get Verification Code"}</span>
                  {!loading && <FaArrowRight className="lm-btn-arrow" />}
                  {loading && <span className="lm-spinner"></span>}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Step 2 Header */}
              <div className="lm-header">
                <div className="lm-icon-circle">
                  <FaShieldAlt />
                </div>
                <h2>Verify Identity</h2>
                <p>
                  Enter the 6-digit code sent to{" "}
                  <strong>+91 {phone.replace(/(\d{5})(\d{5})/, "$1 $2")}</strong>
                </p>
              </div>

              {/* Step 2 OTP Boxes */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerifyOtp();
                }}
              >
                <div className="lm-otp-row" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      className={`lm-otp-box ${digit ? "filled" : ""}`}
                      value={digit}
                      maxLength="1"
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>

                <button type="submit" className="lm-btn" disabled={loading}>
                  <span>{loading ? "Verifying…" : "Verify & Continue"}</span>
                  {!loading && <FaArrowRight className="lm-btn-arrow" />}
                  {loading && <span className="lm-spinner"></span>}
                </button>
              </form>

              {/* Footer */}
              <div className="lm-footer">
                <div className="lm-timer-section">
                  {timer > 0 ? (
                    <div className="lm-timer">
                      <svg className="lm-timer-svg" viewBox="0 0 36 36">
                        <circle
                          className="lm-timer-bg"
                          cx="18"
                          cy="18"
                          r="15.5"
                        />
                        <circle
                          className="lm-timer-fg"
                          cx="18"
                          cy="18"
                          r="15.5"
                          strokeDasharray={`${timerPercentage} 100`}
                        />
                      </svg>
                      <span className="lm-timer-text">{timer}s</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="lm-link-btn"
                      onClick={handleResendOtp}
                    >
                      Resend Code
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="lm-link-btn"
                  onClick={() => {
                    setStep(1);
                    setOtp(["", "", "", "", "", ""]);
                    setError("");
                    setSuccess("");
                  }}
                >
                  Change Number
                </button>
              </div>
            </>
          )}

          {/* Trust badges */}
          <div className="lm-trust">
            <FaShieldAlt className="lm-trust-icon" />
            <span>Secured with end-to-end encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;