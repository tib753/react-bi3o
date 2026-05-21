import { useState } from "react";
import { getAuthInstance } from "../../../firebase.js";

const useFirebasePhoneAuth = () => {
  const [verificationId, setVerificationId] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(null);

  const setUpRecaptcha = async () => {
    if (!window.recaptchaVerifier) {
      const { RecaptchaVerifier } = await import("firebase/auth");
      const auth = await getAuthInstance();
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {},
          "expired-callback": () => {
            window.recaptchaVerifier?.reset();
          },
        },
        auth,
      );
    } else {
      window.recaptchaVerifier?.clear();
      setUpRecaptcha();
    }
  };

  const sendOTP = async (phoneNumber) => {
    setError(null);
    await setUpRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const { signInWithPhoneNumber } = await import("firebase/auth");
    const auth = await getAuthInstance();
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setIsOtpSent(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return {
    sendOTP,
    verificationId,
    isOtpSent,
    error,
  };
};

export default useFirebasePhoneAuth;
