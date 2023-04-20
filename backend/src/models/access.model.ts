import { model, Model, Schema, Types } from "mongoose";
import { ACCESS } from "../config/roles";
import { toJSON, excludeDeletedItems } from "./plugins";

export interface IAccess extends Document {
  _id: Types.ObjectId;
  userid: string;
  access: ACCESS;
}

export interface AccessModel extends Model<IAccess> {}

const accessSchema = new Schema<any, AccessModel>(
  {
    userid: {
      type: String,
      required: true,
      trim: true,
    },
    access: {
      type: String,
      enum: ACCESS,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
accessSchema.plugin(toJSON);
accessSchema.plugin(excludeDeletedItems);

/**
 * @typedef Access
 */
export const Access = model<IAccess, AccessModel>("Access", accessSchema);
