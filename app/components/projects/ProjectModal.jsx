"use client";
import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import { useCreateProjectMutation } from "@/app/redux/api/ProjectsApiSlice";
import toast from "react-hot-toast";

/**
 * Project Create Modal
 * Backend DTO: CreateProjectRequest { name }
 */
export default function ProjectModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [createProject, { isLoading }] = useCreateProjectMutation();

  useEffect(() => {
    if (!isOpen) {
      setName("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await createProject({ name }).unwrap();
      toast.success("Project created successfully");
      if (onSuccess && result?.id) {
        onSuccess(result.id);
      }
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error.data?.message || "Failed to create project");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Project" size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Project Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={255}
          placeholder="Enter project name"
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
            {isLoading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
