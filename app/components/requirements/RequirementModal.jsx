"use client";
import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import { useUpsertRequirementMutation, useGetRequirementsByProjectQuery } from "@/app/redux/api/RequirementApiSlice";
import { useListAllProjectsQuery } from "@/app/redux/api/ProjectsApiSlice";
import { Folder } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Requirement Create/Edit Modal
 * Backend DTO: RequirementUpsertRequest
 */
export default function RequirementModal({ isOpen, onClose, projectId, requirement = null }) {
  const { data: projects = [] } = useListAllProjectsQuery();
  const currentProject = projects.find(p => p.id === projectId);

  const [formData, setFormData] = useState({
    frRefCode: "",
    appRef: "",
    description: "",
    priority: "MEDIUM",
    parentId: ""
  });

  const [upsertRequirement, { isLoading }] = useUpsertRequirementMutation();
  const { data: allRequirements = [] } = useGetRequirementsByProjectQuery(projectId, {
    skip: !projectId || !!requirement
  });

  const parentOptions = allRequirements
    .filter(r => r.id !== requirement?.id)
    .map(r => ({ value: r.id, label: `${r.frRefCode} - ${r.description?.substring(0, 60)}` }));

  useEffect(() => {
    if (requirement) {
      setFormData({
        frRefCode: requirement.frRefCode || "",
        appRef: requirement.appRef || "",
        description: requirement.description || "",
        priority: requirement.priority || "MEDIUM",
        parentId: requirement.parentId || ""
      });
    } else {
      setFormData({
        frRefCode: "",
        appRef: "",
        description: "",
        priority: "MEDIUM",
        parentId: ""
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
        parentId: formData.parentId ? parseInt(formData.parentId) : null,
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
      {currentProject && (
        <div className="flex items-center gap-2 px-1 -mt-2 mb-4">
          <Folder size={14} className="text-navy/40" />
          <span className="text-xs font-semibold text-navy/50">Project: {currentProject.name}</span>
        </div>
      )}
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

        <FormSelect
          label="Parent Requirement"
          name="parentId"
          value={formData.parentId}
          onChange={handleChange}
          options={[
            { value: "", label: "None (top-level requirement)" },
            ...parentOptions
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
