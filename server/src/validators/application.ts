import { z } from "zod";

export const createApplicationSchema = z.object({
  serviceType: z.enum(["id-renewal"]),
  payload: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.string().min(1),
    idNumber: z.string().min(5),
    address: z.string().min(5),
  }),
  submit: z.boolean().optional(),
});
