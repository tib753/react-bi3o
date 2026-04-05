import * as Yup from "yup";
import { t } from "i18next";

const deliveryManValidationSchema = Yup.object().shape({
  f_name: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name can't exceed 50 characters"),

  l_name: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name can't exceed 50 characters"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  phone: Yup.string()
    .required(t("phone number required"))
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
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password can't exceed 20 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&#]/, "Password must contain at least one special symbol"),
  confirm_password: Yup.string()
    .required("Confirm Password required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  earning: Yup.number()
    .typeError("Earning must be a number")
    .required("Earning is required"),

  zone_id: Yup.string().required("Zone selection is required"),

  vehicle_id: Yup.string().required("Vehicle selection is required"),

  identity_type: Yup.string()
    .required("Identity type is required")
    .oneOf(["passport", "driving_license", "nid"], "Invalid identity type"),

  identity_number: Yup.string().required("Identity number is required"),
  image: Yup.mixed()
    .required("Profile image is required")
    .test("fileType", "Only images are allowed", (value) =>
      value
        ? ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        : false
    ),

  // identity_image: Yup.mixed()
  //   .required("Identity image is required")
  //   .test("fileType", "Only images are allowed", (value) =>
  //     value
  //       ? ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
  //       : false
  //   ),
});

export default deliveryManValidationSchema;
