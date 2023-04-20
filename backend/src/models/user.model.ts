import validator from "validator";
import * as bcrypt from "bcryptjs";
import { model, Model, Schema, Types } from "mongoose";
import { PaginatedModel } from "./types";
import { ROLES } from "../config/roles";
import { paginate, toJSON, excludeDeletedItems } from "./plugins";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  usermail: string;
  userpass: string;
  userphone: string;
  creator: string;
  role: ROLES;

  isPasswordMatch(password: string): Promise<boolean>;
}

export interface UserModel extends Model<IUser>, PaginatedModel<IUser> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;

  isPhoneTaken(phone: string, excludeUserId?: string): Promise<boolean>;
}

const userSchema = new Schema<any, UserModel>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: String,
      default: "",
    },
    usermail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: any) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    userphone: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      default: "",
    },
    userpass: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (
          (this.role !== ROLES.PATIENT && !value.match(/\d/)) ||
          !value.match(/[a-zA-Z]/)
        ) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: ROLES,
      default: "doctor",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(excludeDeletedItems);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (
  email: string,
  excludeUserId: string
): Promise<boolean> {
  const user = await this.findOne({
    usermail: email,
    _id: { $ne: excludeUserId },
  });
  return !!user;
};

/**
 * Check if email is taken
 * @param {string} phone - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneTaken = async function (
  phone: string,
  excludeUserId: string
): Promise<boolean> {
  const user = await this.findOne({
    userphone: phone,
    _id: { $ne: excludeUserId },
  });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (
  password: string
): Promise<boolean> {
  const user = this;
  return bcrypt.compare(password, user.userpass);
};

userSchema.pre("save", async function (this: any, next: any) {
  const user = this;
  if (user.isModified("userpass")) {
    user.userpass = await bcrypt.hash(user.userpass, 8);
  }
  next();
});

/**
 * @typedef User
 */
export const User = model<IUser, UserModel>("User", userSchema);
