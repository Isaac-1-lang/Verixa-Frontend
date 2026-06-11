"use client";
import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import { useCreateTestRunMutation } from "@/app/redux/api/TestRunApiSlice";
import { useListAllProjectsQuery } from "@/app/redux/api/ProjectsApiSlice";
import { Folder } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Test Run Create Modal
 * Backend DTO: CreateRunRequest { projectId, name, environment }
 */
export default function TestRunModal({ isOpen, onClose, projectId }) {
  const { data: projects = [] } = useListAllProjectsQuery();
  const currentProject = projects.find(p => p.id === projectId);

  const [formData, setFormData] = useState({
    name: "",
    environment: "UAT"
  });

  const [createTestRun, { isLoading }] = useCreateTestRunMutation();

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        environment: "UAT"
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
        projectId,
        name: formData.name,
        environment: formData.environment
      };

      await createTestRun(payload).unwrap();
      toast.success("Test run created successfully");
      onClose();
    } catch (error) {
      console.error("Error creating test run:", error);
      toast.error(error.data?.message || "Failed to create test run");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Test Run" size="sm">
      {currentProject && (
        <div className="flex items-center gap-2 px-1 -mt-2 mb-4">
          <Folder size={14} className="text-navy/40" />
          <span className="text-xs font-semibold text-navy/50">Project: {currentProject.name}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Run Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={255}
          placeholder="Sprint 23 UAT"
        />

        <FormSelect
          label="Environment"
          name="environment"
          value={formData.environment}
          onChange={handleChange}
          options={[
            { value: "DEV", label: "Development" },
            { value: "QA", label: "QA" },
            { value: "UAT", label: "UAT" },
            { value: "STAGING", label: "Staging" },
            { value: "PRODUCTION", label: "Production" }
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
            {isLoading ? "Creating..." : "Create Test Run"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
