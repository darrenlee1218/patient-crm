require("dotenv").config();

export const config = {
  appEnv: process.env.NODE_ENV || "development",
  appPort: process.env.SERVER_PORT || "4000",
  dbUrl: process.env.MONGODB_URL_API || "",
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || 120,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS || 10,
    resetPasswordExpirationMinutes:
      process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES || 10,
    verifyEmailExpirationMinutes:
      process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES || 10,
  },
};
