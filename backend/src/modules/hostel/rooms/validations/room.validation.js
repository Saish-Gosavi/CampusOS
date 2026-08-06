import { z } from "zod";

export const roomSchema = z.object({
  number: z.string().min(1, "Room number is required"),
  floorId: z.preprocess((val) => Number(val), z.number().int("Floor ID must be an integer")),
  capacity: z.preprocess((val) => Number(val), z.number().int("Capacity must be an integer").positive("Capacity must be positive")),
  rent: z.preprocess((val) => Number(val), z.number().positive("Rent must be positive")),
});

export const updateRoomSchema = z.object({
  number: z.string().min(1, "Room number cannot be empty").optional(),
  floorId: z.preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().int().optional()),
  capacity: z.preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().int().positive().optional()),
  rent: z.preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().positive().optional()),
});
