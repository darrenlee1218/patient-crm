//Import the mongoose module
import { config } from "../config/config";
import { User } from "../models/user.model";
import { ROLES } from "../config/roles";
import { Logger } from "../config/logger";
import { MongoConnector } from "../utils/db";

const seed = async () => {
  await MongoConnector.start();

  await User.create({
    username: process.env.SEED_ADMIN_NAME || "admin",
    usermail: process.env.SEED_ADMIN_EMAIL || "admin@mail.com",
    userpass: process.env.SEED_ADMIN_PASSWORD || "pasS!@#456",
    role: ROLES.ADMIN,
  });
};

seed()
  .then(() => {
    Logger.info("Data seeded successfully.");
    process.exit(0);
  })
  .catch((err) => {
    Logger.error(err);
    process.exit(1);
  });
