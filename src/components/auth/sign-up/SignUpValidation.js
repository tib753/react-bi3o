import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const SignUpValidation = () => {
  const { t } = useTranslation();

  return Yup.object({
    name: Yup.string().required(t("First name is required")),
    email: Yup.string()
      .email(t("Must be a valid email"))
      .max(255)
      .required(t("Email is required")),
    phone: Yup.string()
      .required(t("Please give a phone number"))
      .test(
        "phone-algeria-9-digits",
        t(
          "Phone number must be like +213 and exactly 9 digits after the country code (example: +213552787246)."
        ),
        (value) => {
          if (!value) return false;
          const digits = String(value).replace(/\D/g, "");
          if (!digits.startsWith("213")) return false;
          const local = digits.slice(3);
          return local.length === 9;
        }
      ),
    password: Yup.string()
      .required(t("Password is required"))
      .min(6, t("Password is too short - should be 6 chars minimum.")),
    confirm_password: Yup.string()
      .required(t("Confirm Password"))
      .oneOf([Yup.ref("password"), null], t("Passwords must match")),
    //tandc: Yup.boolean().oneOf([true], "Message"),
  });
};

export default SignUpValidation;
