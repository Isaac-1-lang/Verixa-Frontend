"use client";
import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import DefectModal from "../defects/DefectModal";
import { useSaveExecutionMutation } from "@/app/redux/api/ExecutionApiSlice";
import { AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const RESULT_OPTIONS = [
  { value: "NOT_RUN", label: "Not Run" },
  { value: "PASSED", label: "Passed" },
  { value: "PARTIALLY_PASSED", label: "Partially Passed" },
  { value: "FAILED", label: "Failed" },
  { value: "FEATURE_NOT_AVAILABLE", label: "Feature Not Available" },
  { value: "BLOCKED", label: "Blocked" },
];

const STEP_RESULT_OPTIONS = [
  { value: "NOT_RUN", label: "Not Run" },
  { value: "PASSED", label: "Passed" },
  { value: "FAILED", label: "Failed" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "SKIPPED", label: "Skipped" },
];

// Results that warrant logging a defect
const FAILED_RESULTS = ["FAILED", "BLOCKED", "PARTIALLY_PASSED"];

export default function ExecutionModal({ isOpen, onClose, execution = null, runId, testCaseId }) {
  const [formData, setFormData] = useState({
    result: "NOT_RUN",
    overallComment: "",
    stepResults: []
  });

  // After saving: show defect prompt
  const [savedExecutionId, setSavedExecutionId] = useState(null);
  const [showDefectPrompt, setShowDefectPrompt] = useState(false);
  const [isDefectModalOpen, setIsDefectModalOpen] = useState(false);

  const [saveExecution, { isLoading }] = useSaveExecutionMutation();

  useEffect(() => {
    if (!isOpen) {
      // Reset everything when modal closes
      setSavedExecutionId(null);
      setShowDefectPrompt(false);
      setIsDefectModalOpen(false);
      return;
    }

    if (execution) {
      const stepResults = (execution.steps || []).map(se => ({
        stepOrder: se.stepOrder,
        result: se.result || "NOT_RUN",
        actualResult: se.actualResult || "",
      }));

      setFormData({
        result: execution.result || "NOT_RUN",
        overallComment: execution.overallComment || "",
        stepResults,
      });
    }
  }, [execution, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      stepResults: prev.stepResults.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        runId,
        testCaseId,
        result: formData.result,
        overallComment: formData.overallComment || null,
        stepResults: formData.stepResults.map(step => ({
          stepOrder: step.stepOrder,
          result: step.result,
          actualResult: step.actualResult || null,
        }))
      };

      await saveExecution(payload).unwrap();
      toast.success("Execution saved successfully");

      // If result is a failure type, show defect prompt
      if (FAILED_RESULTS.includes(formData.result)) {
        setSavedExecutionId(execution?.id);
        setShowDefectPrompt(true);
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error saving execution:", error);
      toast.error(error?.data?.message || "Failed to save execution");
    }
  };

  const handleDefectCreated = () => {
    setIsDefectModalOpen(false);
    onClose();
  };

  const handleSkipDefect = () => {
    onClose();
  };

  const testCaseInfo = execution?.testCase;
  const steps = execution?.steps || [];

  // --- Defect Prompt Screen (shown after failed execution saved) ---
  if (showDefectPrompt) {
    return (
      <>
        <Modal isOpen={isOpen} onClose={handleSkipDefect} title="Execution Saved" size="sm">
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <div>
              <p className="text-zinc-900 font-bold text-lg">Test Failed</p>
              <p className="text-zinc-600 text-sm mt-1">
                The execution was saved with result <span className="font-semibold text-red-600">{formData.result.replace(/_/g, " ")}</span>.
                <br />Would you like to log a defect for this failure?
              </p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={handleSkipDefect}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-zinc-700 hover:bg-zinc-100 border border-zinc-200 transition-all"
              >
                Skip for Now
              </button>
              <button
                onClick={() => setIsDefectModalOpen(true)}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-red-600 text-white hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
              >
                <AlertCircle size={16} /> Log Defect
              </button>
            </div>
          </div>
        </Modal>

        {/* Defect Modal opens on top */}
        <DefectModal
          isOpen={isDefectModalOpen}
          onClose={() => setIsDefectModalOpen(false)}
          executionId={savedExecutionId}
          onSuccess={handleDefectCreated}
        />
      </>
    );
  }

  // --- Main Execution Form ---
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Execute Test Case" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Test Case Info */}
        {testCaseInfo && (
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Test Case</p>
            <p className="font-semibold text-zinc-900">{testCaseInfo.tcNumber} — {testCaseInfo.title}</p>
            {testCaseInfo.appRef && (
              <p className="text-xs text-zinc-500 mt-1">App Ref: {testCaseInfo.appRef}</p>
            )}
          </div>
        )}

        {/* Overall Result */}
        <FormSelect
          label="Overall Result"
          name="result"
          value={formData.result}
          onChange={handleChange}
          options={RESULT_OPTIONS}
        />

        {/* Overall Comment */}
        <FormInput
          label="Overall Comment"
          name="overallComment"
          type="textarea"
          value={formData.overallComment}
          onChange={handleChange}
          rows={3}
          placeholder="Enter overall execution comment"
        />

        {/* Step Results */}
        {steps.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-zinc-900">Step Results</h3>
            {formData.stepResults.map((stepResult, index) => {
              const stepDetail = testCaseInfo?.steps?.find(s => s.stepOrder === stepResult.stepOrder);
              return (
                <div key={index} className={`p-4 border-2 rounded-xl space-y-3 ${
                  stepResult.result === "FAILED" ? "border-red-200 bg-red-50/30" :
                  stepResult.result === "PASSED" ? "border-emerald-200 bg-emerald-50/30" :
                  "border-zinc-200"
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {stepResult.stepOrder}
                    </span>
                    <span className="text-xs font-semibold text-zinc-600">Step {stepResult.stepOrder}</span>
                    {stepResult.result === "PASSED" && <CheckCircle size={14} className="text-emerald-600 ml-auto" />}
                    {stepResult.result === "FAILED" && <AlertCircle size={14} className="text-red-600 ml-auto" />}
                  </div>

                  {stepDetail && (
                    <div className="text-xs text-zinc-600 space-y-1 bg-white p-3 rounded-lg border border-zinc-100">
                      {stepDetail.action && <p><span className="font-semibold">Action:</span> {stepDetail.action}</p>}
                      {stepDetail.expectedResult && <p><span className="font-semibold">Expected:</span> {stepDetail.expectedResult}</p>}
                    </div>
                  )}

                  <FormSelect
                    label="Result"
                    value={stepResult.result}
                    onChange={(e) => handleStepChange(index, "result", e.target.value)}
                    options={STEP_RESULT_OPTIONS}
                  />

                  <FormInput
                    label="Actual Result"
                    value={stepResult.actualResult}
                    onChange={(e) => handleStepChange(index, "actualResult", e.target.value)}
                    placeholder="What actually happened?"
                  />
                </div>
              );
            })}
          </div>
        )}

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
            {isLoading ? "Saving..." : "Save Execution"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
