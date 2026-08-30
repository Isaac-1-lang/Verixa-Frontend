"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import { useCreateProjectMutation } from "@/app/redux/api/ProjectsApiSlice";
import toast from "react-hot-toast";
import { PROJECT_STAGES, projectRoute } from "@/app/config/projectStages";
import { useProject } from "@/app/context/ProjectContext";

/**
 * Project Create Modal
 * Backend DTO: CreateProjectRequest { name }
 */
export default function ProjectModal({ isOpen, onClose, onSuccess }) {
  const router = useRouter();
  const { selectProject } = useProject();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState("UAT");
  const [error, setError] = useState("");
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const close = () => {
    setName("");
    setDescription("");
    setStage("UAT");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      const result = await createProject({ name: name.trim(), description: description.trim() || null, stage }).unwrap();
      toast.success("Project created successfully");
      if (result?.id) selectProject(result.id);
      if (onSuccess) onSuccess(result);
      close();
      router.push(projectRoute(result));
    } catch (error) {
      console.error("Error creating project:", error);
      const message = error.data?.message || "Failed to create project";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title="Create Project" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
        <FormInput
          label="Project Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={255}
          placeholder="Enter project name"
        />

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-500">Description</label>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={4000} rows={3} className="input-field w-full resize-none rounded-xl px-4 py-2.5 text-sm" placeholder="Optional project context" />
        </div>

        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Current project stage</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {PROJECT_STAGES.map((option) => <label key={option.value} className={`cursor-pointer rounded-xl border p-4 transition ${stage === option.value ? 'border-navy bg-navy/[.04]' : 'border-zinc-200 hover:border-zinc-300'}`}>
              <span className="flex items-start gap-3"><input type="radio" name="projectStage" value={option.value} checked={stage === option.value} onChange={() => setStage(option.value)} className="mt-1 accent-navy" /><span><span className="block text-sm font-bold text-navy">{option.label}</span><span className="mt-1 block text-xs leading-relaxed text-navy/50">{option.description}</span></span></span>
            </label>)}
          </div>
        </fieldset>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
          <button
            type="button"
            onClick={close}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm text-zinc-700 hover:bg-zinc-100 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-[var(--primary)] text-white hover:bg-[#5851e6] transition-all shadow-lg shadow-[var(--primary)]/20 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
