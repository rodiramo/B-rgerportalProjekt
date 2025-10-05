import { Schema, model, Types } from "mongoose";

export type Status =
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "NEEDS_INFO"
  | "RESUBMITTED"
  | "APPROVED"
  | "ISSUED"
  | "REJECTED";

const HistorySchema = new Schema({
  by: { type: Types.ObjectId, ref: "User" },
  at: { type: Date, default: Date.now },
  action: String,
  note: String,
});

const ApplicationSchema = new Schema(
  {
    citizen: { type: Types.ObjectId, ref: "User", required: true, index: true },
    serviceType: { type: String, required: true }, // e.g., 'id-renewal'
    status: { type: String, required: true, default: "DRAFT" },
    payload: {
      firstName: String,
      lastName: String,
      dateOfBirth: String,
      idNumber: String,
      address: String,
    },
    attachments: [
      {
        key: String,
        filename: String,
        mimeType: String,
        size: Number,
      },
    ],
    history: [HistorySchema],
  },
  { timestamps: true }
);

export default model("Application", ApplicationSchema);
