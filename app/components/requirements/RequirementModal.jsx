"use client";
import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import { useUpsertRequirementMutation } from "@/app/redux/api/RequirementApiSlice";
import toast from "react-hot-toast";

/**
 * Requirement Create/Edit Modal
 * Backend DTO: RequirementUpsertRequest
 */
export default function RequirementModal({ isOpen, onClose, projectId, requirement = null }) {
  const [formData, setFormData] = useState({
    frRefCode: "",
    appRef: "",
    description: "",
    priority: "MEDIUM"
  });

  const [upsertRequirement, { isLoading }] = useUpsertRequirementMutation();

  useEffect(() => {
    if (requirement) {
      setFormData({
        frRefCode: requirement.frRefCode || "",
        appRef: requirement.appRef || "",
        description: requirement.description || "",
        priority: requirement.priority || "MEDIUM"
      });
    } else {
      setFormData({
        frRefCode: "",
        appRef: "",
        description: "",
        priority: "MEDIUM"
      });
    }
  }, [requirement, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        id: requirement?.id || null,
        projectId,
        frRefCode: formData.frRefCode,
        appRef: formData.appRef || null,
        description: formData.description,
        priority: formData.priority
      };

      await upsertRequirement(payload).unwrap();
      toast.success(requirement ? "Requirement updated successfully" : "Requirement created successfully");
      onClose();
    } catch (error) {
      console.error("Error saving requirement:", error);
      toast.error(error.data?.message || "Failed to save requirement");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={requirement ? "Edit Requirement" : "Create Requirement"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="FR Reference Code"
          name="frRefCode"
          value={formData.frRefCode}
          onChange={handleChange}
          required
          maxLength={50}
          placeholder="FR-001"
        />

        <FormInput
          label="App Reference"
          name="appRef"
          value={formData.appRef}
          onChange={handleChange}
          maxLength={180}
          placeholder="Application reference"
        />

        <FormInput
          label="Description"
          name="description"
          type="textarea"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Enter requirement description"
        />

        <FormSelect
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={[
            { value: "LOW", label: "Low" },
            { value: "MEDIUM", label: "Medium" },
            { value: "HIGH", label: "High" },
            { value: "CRITICAL", label: "Critical" }
          ]}
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
            {isLoading ? "Saving..." : requirement ? "Update Requirement" : "Create Requirement"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
