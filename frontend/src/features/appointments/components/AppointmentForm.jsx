// frontend/src/features/appointments/components/AppointmentForm.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAppointment,
  updateAppointment,
} from "../../../api/appointments";
import { BottomSheet, Button, Input, Select } from "../../../components/ui";
import { toast } from "sonner";
import { useEffect } from "react";
import { motion } from "framer-motion";

const appointmentSchema = z.object({
  patient_id: z.string().min(1, "Patient is required"),
  doctor_id: z.string().min(1, "Doctor is required"),
  appointment_date: z.string().min(1, "Date is required"),
  appointment_time: z.string().min(1, "Time is required"),
  reason: z.string().optional(),
  remarks: z.string().optional(),
});

const fieldSpring = {
  type: 'spring',
  stiffness: 350,
  damping: 28,
  mass: 0.6,
  bounce: 0.05,
};

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
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_id: "",
      doctor_id: "",
      appointment_date: "",
      appointment_time: "",
      reason: "",
      remarks: "",
    },
    mode: "onChange",
  });

  // Watch all values for debugging
  const watchedValues = watch();
  console.log("📝 Form values:", watchedValues);

  useEffect(() => {
    if (appointment) {
      reset({
        patient_id: appointment.patient_id?.toString() || "",
        doctor_id: appointment.doctor_id?.toString() || "",
        appointment_date: appointment.appointment_date || "",
        appointment_time: appointment.appointment_time || "",
        reason: appointment.reason || "",
        remarks: appointment.remarks || "",
      });
    } else {
      reset({
        patient_id: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        reason: "",
        remarks: "",
      });
    }
  }, [appointment, reset]);

  const mutation = useMutation({
    mutationFn: (data) => {
      console.log("📡 Submitting appointment data:", data);
      const cleanedData = {
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        appointment_date: data.appointment_date,
        appointment_time: data.appointment_time,
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
      reset();
    },
    onError: (error) => {
      console.error("❌ Mutation error:", error);
      toast.error(error.response?.data?.detail || "Operation failed");
    },
  });

  const onSubmit = (data) => {
    console.log("📝 Form submitted with data:", data);
    mutation.mutate(data);
  };

  const getFieldDelay = (index) => 0.05 + index * 0.03;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={appointment ? "Edit Appointment" : "Book Appointment"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Patient Select with Label */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(0) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Patient <span className="text-danger">*</span>
          </label>
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
            placeholder="Select Patient"
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
            value={watchedValues.patient_id || ""}
          />
        </motion.div>

        {/* Doctor Select with Label */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(1) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Doctor <span className="text-danger">*</span>
          </label>
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
            placeholder="Select Doctor"
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
            value={watchedValues.doctor_id || ""}
          />
        </motion.div>

        {/* Date with Label */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(2) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Appointment Date <span className="text-danger">*</span>
          </label>
          <Input
            type="date"
            {...register("appointment_date")}
            error={errors.appointment_date?.message}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        {/* Time with Label */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(3) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Appointment Time <span className="text-danger">*</span>
          </label>
          <Input
            type="time"
            {...register("appointment_time")}
            error={errors.appointment_time?.message}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        {/* Reason with Label */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(4) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Reason for Visit
          </label>
          <Input
            placeholder="Enter reason for visit"
            {...register("reason")}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        {/* Remarks with Label */}
        <motion.div 
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(5) }}
        >
          <label className="block text-sm font-medium text-text dark:text-dark-text">
            Remarks
          </label>
          <Input
            placeholder="Enter remarks (optional)"
            {...register("remarks")}
            className="bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm border-white/30 dark:border-dark-border/30"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex justify-end gap-3 pt-4 mt-4 border-t border-white/20 dark:border-dark-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...fieldSpring, delay: getFieldDelay(6) }}
        >
          <Button 
            variant="secondary" 
            type="button" 
            onClick={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={mutation.isPending}
          >
            {appointment ? "Update" : "Book"} Appointment
          </Button>
        </motion.div>
      </form>
    </BottomSheet>
  );
};