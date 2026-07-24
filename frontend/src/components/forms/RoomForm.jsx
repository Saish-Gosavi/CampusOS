import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema } from "@/validations/schemas";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export function RoomForm({ onSubmit, initialValues = {}, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Room Number"
        type="text"
        placeholder="e.g. 101"
        error={errors.roomNumber?.message}
        {...register("roomNumber")}
      />

      <Input
        label="Block Name"
        type="text"
        placeholder="e.g. A Block"
        error={errors.blockName?.message}
        {...register("blockName")}
      />

      <Input
        label="Capacity"
        type="number"
        placeholder="e.g. 3"
        error={errors.capacity?.message}
        {...register("capacity")}
      />

      <Input
        label="Rent (Monthly)"
        type="number"
        step="0.01"
        placeholder="e.g. 5000"
        error={errors.rent?.message}
        {...register("rent")}
      />

      <Button loading={loading} type="submit" className="w-full">
        {initialValues.roomNumber ? "Save Changes" : "Create Room"}
      </Button>
    </form>
  );
}
