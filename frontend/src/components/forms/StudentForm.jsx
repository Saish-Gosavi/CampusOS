import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "@/validations/schemas";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";

export function StudentForm({ onSubmit, initialValues = {}, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        placeholder="e.g. John Doe"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <Input
        label="Email"
        type="email"
        placeholder="e.g. john.doe@college.edu"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="e.g. +919876543210"
        error={errors.phone?.message}
        {...register("phone")}
      />

      <Input
        label="College ID / Roll No"
        type="text"
        placeholder="e.g. 2026CS101"
        error={errors.collegeId?.message}
        {...register("collegeId")}
      />

      <Input
        label="Assigned Room (Optional)"
        type="text"
        placeholder="e.g. 101"
        error={errors.roomNumber?.message}
        {...register("roomNumber")}
      />

      <Button loading={loading} type="submit" className="w-full">
        {initialValues.fullName ? "Save Changes" : "Register Student"}
      </Button>
    </form>
  );
}
