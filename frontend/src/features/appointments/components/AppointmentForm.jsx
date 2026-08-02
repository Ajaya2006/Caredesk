import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAppointment,
  updateAppointment,
} from "../../../api/appointments";
import { BottomSheet, Button, Input, Select } from "../../../Components/ui";
import { toast } from "sonner";
import { useEffect } from "react";

const appointmentSchema = z.object({
  patient_id: z.string().min(1, "Patient is required"),
  doctor_id: z.string().min(1, "Doctor is required"),
  appointment_date: z.string().min(1, "Date is required"),
  appointment_time: z.string().min(1, "Time is required"),
  reason: z.string().optional(),
  remarks: z.string().optional(),
});

export const AppointmentForm = ({
  isOpen,
  onClose,
  appointment,
  doctors,
  patients,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: "",
      doctor_id: "",
      appointment_date: new Date().toISOString().slice(0, 10),
      appointment_time: "09:00",
      reason: "",
      remarks: "",
    },
  });

  useEffect(() => {
    if (appointment) {
      reset({
        patient_id: appointment.patient_id?.toString() || "",
        doctor_id: appointment.doctor_id?.toString() || "",
        appointment_date:
          appointment.appointment_date || new Date().toISOString().slice(0, 10),
        appointment_time: appointment.appointment_time || "09:00",
        reason: appointment.reason || "",
        remarks: appointment.remarks || "",
      });
    } else {
      reset({
        patient_id: "",
        doctor_id: "",
        appointment_date: new Date().toISOString().slice(0, 10),
        appointment_time: "09:00",
        reason: "",
        remarks: "",
      });
    }
  }, [appointment, reset]);

  const mutation = useMutation({
    mutationFn: (data) => {
      const cleanedData = {
        ...data,
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        reason: data.reason || null,
        remarks: data.remarks || null,
      };
      return appointment
        ? updateAppointment(appointment.appointment_id, cleanedData)
        : createAppointment(cleanedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      toast.success(
        appointment
          ? "Appointment updated successfully"
          : "Appointment booked successfully",
      );
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || "Operation failed");
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={appointment ? "Edit Appointment" : "Book Appointment"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          options={[
            { value: "", label: "Select Patient" },
            ...patients.map((p) => ({
              value: String(p.patient_id),
              label: p.patient_name,
            })),
          ]}
          {...register("patient_id")}
          error={errors.patient_id?.message}
        />
        <Select
          options={[
            { value: "", label: "Select Doctor" },
            ...doctors.map((d) => ({
              value: String(d.doctor_id),
              label: d.doctor_name,
            })),
          ]}
          {...register("doctor_id")}
          error={errors.doctor_id?.message}
        />
        <Input
          type="date"
          {...register("appointment_date")}
          error={errors.appointment_date?.message}
        />
        <Input
          type="time"
          {...register("appointment_time")}
          error={errors.appointment_time?.message}
        />
        <Input placeholder="Reason for visit" {...register("reason")} />
        <Input placeholder="Remarks (optional)" {...register("remarks")} />
        <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-dark-border">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={mutation.isPending}
          >
            {appointment ? "Update" : "Book"} Appointment
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
};
