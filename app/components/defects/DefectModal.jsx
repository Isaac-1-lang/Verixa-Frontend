"use client";
import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import { useCreateDefectMutation } from "@/app/redux/api/DefectApiSlice";
import toast from "react-hot-toast";

/**
 * Defect Create Modal
 * Backend DTO: CreateDefectRequest
 */
export default function DefectModal({ isOpen, onClose, executionId, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    severity: "MEDIUM",
    status: "OPEN",
    description: "",
    reproductionSteps: ""
  });

  const [createDefect, { isLoading }] = useCreateDefectMutation();

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        severity: "MEDIUM",
        status: "OPEN",
        description: "",
        reproductionSteps: ""
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        executionId,
        title: formData.title,
        severity: formData.severity,
        status: formData.status,
        description: formData.description || null,
        reproductionSteps: formData.reproductionSteps || null
      };

      await createDefect(payload).unwrap();
      toast.success("Defect created successfully");
      if (onSuccess) onSuccess();
      else onClose();
    } catch (error) {
      console.error("Error creating defect:", error);
      toast.error(error.data?.message || "Failed to create defect");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Defect" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={255}
          placeholder="Enter defect title"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            options={[
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
              { value: "CRITICAL", label: "Critical" }
            ]}
          />

          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: "OPEN", label: "Open" },
              { value: "IN_PROGRESS", label: "In Progress" },
              { value: "RESOLVED", label: "Resolved" },
              { value: "CLOSED", label: "Closed" },
              { value: "REOPENED", label: "Reopened" }
            ]}
          />
        </div>

        <FormInput
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Enter defect description"
        />

        <FormInput
          label="Reproduction Steps"
          name="reproductionSteps"
          type="textarea"
          value={formData.reproductionSteps}
          onChange={handleChange}
          rows={4}
          placeholder="Enter steps to reproduce the defect"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-zinc-700 hover:bg-zinc-100 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Defect"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
