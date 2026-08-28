"use client";
import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import { useSignOffRunMutation } from "@/app/redux/api/SignOffApiSlice";
import toast from "react-hot-toast";

/**
 * Run Sign-off Modal
 * Backend DTO: SignOffRequest
 */
export default function SignOffModal({ isOpen, onClose, runId }) {
  const [formData, setFormData] = useState({
    decision: "APPROVED",
    comments: ""
  });

  const [signOffRun, { isLoading }] = useSignOffRunMutation();

  useEffect(() => {
    if (!isOpen) {
      // Reset only when the modal closes; this is intentional modal lifecycle state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        decision: "APPROVED",
        comments: ""
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
        runId,
        decision: formData.decision,
        comment: formData.comments || null
      };

      await signOffRun(payload).unwrap();
      toast.success(`Run ${formData.decision.toLowerCase()} successfully`);
      onClose();
    } catch (error) {
      console.error("Error signing off run:", error);
      toast.error(error.data?.message || "Failed to sign off run");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Off Test Run" size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSelect
          label="Decision"
          name="decision"
          value={formData.decision}
          onChange={handleChange}
          options={[
            { value: "APPROVED", label: "Approve" },
            { value: "REJECTED", label: "Reject" },
            { value: "CONDITIONAL", label: "Conditional Approval" }
          ]}
        />

        <FormInput
          label="Comments"
          name="comments"
          type="textarea"
          value={formData.comments}
          onChange={handleChange}
          rows={4}
          placeholder="Enter sign-off comments"
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
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all shadow-lg disabled:opacity-50 ${
              formData.decision === 'APPROVED' 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' 
                : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
            }`}
          >
            {isLoading ? "Submitting..." : `${formData.decision === 'APPROVED' ? 'Approve' : 'Reject'} Run`}
          </button>
        </div>
      </form>
    </Modal>
  );
}
