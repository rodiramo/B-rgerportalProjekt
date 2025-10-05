import { Schema, model } from "mongoose";

export type Role = "citizen" | "clerk" | "admin";

export interface IUser {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  language?: "de" | "en";
  role: Role;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  firstName: String,
  lastName: String,
  language: { type: String, enum: ["de", "en"], default: "de" },
  role: {
    type: String,
    enum: ["citizen", "clerk", "admin"],
    default: "citizen",
  },
  createdAt: { type: Date, default: Date.now },
});

export default model<IUser>("User", UserSchema);
