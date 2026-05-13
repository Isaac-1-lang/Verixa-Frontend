"use client";
import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import { useSaveExecutionMutation } from "@/app/redux/api/ExecutionApiSlice";
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

export default function ExecutionModal({ isOpen, onClose, execution = null, runId, testCaseId }) {
  const [formData, setFormData] = useState({
    result: "NOT_RUN",
    overallComment: "",
    stepResults: []
  });

  const [saveExecution, { isLoading }] = useSaveExecutionMutation();

  // Initialize form from existing execution data
  useEffect(() => {
    if (!isOpen) return;

    if (execution) {
      // steps come from the DTO as execution.steps
      const stepResults = (execution.steps || []).map(se => ({
        stepOrder: se.stepOrder,
        result: se.result || "NOT_RUN",
        actualResult: se.actualResult || "",
        action: execution.testCase?.steps?.find(s => s.stepOrder === se.stepOrder)?.action || "",
        expectedResult: execution.testCase?.steps?.find(s => s.stepOrder === se.stepOrder)?.expectedResult || "",
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
      onClose();
    } catch (error) {
      console.error("Error saving execution:", error);
      toast.error(error?.data?.message || "Failed to save execution");
    }
  };

  const testCaseInfo = execution?.testCase;
  const steps = execution?.steps || [];

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
              // Get step details from testCase.steps
              const stepDetail = testCaseInfo?.steps?.find(s => s.stepOrder === stepResult.stepOrder);
              return (
                <div key={index} className="p-4 border-2 border-zinc-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {stepResult.stepOrder}
                    </span>
                    <span className="text-xs font-semibold text-zinc-600">Step {stepResult.stepOrder}</span>
                  </div>

                  {stepDetail && (
                    <div className="text-xs text-zinc-600 space-y-1 bg-zinc-50 p-3 rounded-lg">
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
