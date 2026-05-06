"use client";
import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import { useSaveExecutionMutation } from "@/app/redux/api/ExecutionApiSlice";
import { useGetTestCaseByIdQuery } from "@/app/redux/api/TestCaseApiSlice";
import toast from "react-hot-toast";

/**
 * Execution Create/Edit Modal
 * Backend DTO: CreateExecutionRequest
 */
export default function ExecutionModal({ isOpen, onClose, execution = null, runId, testCaseId }) {
  const [formData, setFormData] = useState({
    result: "NOT_EXECUTED",
    overallComment: "",
    stepResults: []
  });

  const [saveExecution, { isLoading }] = useSaveExecutionMutation();
  const { data: testCase } = useGetTestCaseByIdQuery(testCaseId, {
    skip: !testCaseId
  });

  useEffect(() => {
    if (execution) {
      setFormData({
        result: execution.result || "NOT_EXECUTED",
        overallComment: execution.overallComment || "",
        stepResults: execution.stepResults || []
      });
    } else if (testCase?.steps) {
      // Initialize step results from test case steps
      setFormData({
        result: "NOT_EXECUTED",
        overallComment: "",
        stepResults: testCase.steps.map(step => ({
          stepId: step.id,
          result: "NOT_EXECUTED",
          actualResult: "",
          comment: ""
        }))
      });
    }
  }, [execution, testCase, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStepResultChange = (index, field, value) => {
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
        id: execution?.id || null,
        runId,
        testCaseId,
        result: formData.result,
        overallComment: formData.overallComment || null,
        stepResults: formData.stepResults.map(step => ({
          stepId: step.stepId,
          result: step.result,
          actualResult: step.actualResult || null,
          comment: step.comment || null
        }))
      };

      await saveExecution(payload).unwrap();
      toast.success(execution ? "Execution updated successfully" : "Execution saved successfully");
      onClose();
    } catch (error) {
      console.error("Error saving execution:", error);
      toast.error(error.data?.message || "Failed to save execution");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={execution ? "Edit Execution" : "Execute Test Case"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSelect
          label="Overall Result"
          name="result"
          value={formData.result}
          onChange={handleChange}
          options={[
            { value: "NOT_EXECUTED", label: "Not Executed" },
            { value: "PASSED", label: "Passed" },
            { value: "FAILED", label: "Failed" },
            { value: "BLOCKED", label: "Blocked" },
            { value: "SKIPPED", label: "Skipped" }
          ]}
        />

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
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900">Step Results</h3>
          
          {formData.stepResults.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No steps available for this test case.
            </div>
          ) : (
            <div className="space-y-4">
              {formData.stepResults.map((stepResult, index) => {
                const step = testCase?.steps?.[index];
                return (
                  <div key={index} className="p-4 border-2 border-zinc-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-600">Step {index + 1}</span>
                    </div>

                    {step && (
                      <div className="text-xs text-zinc-600 space-y-1">
                        <p><strong>Action:</strong> {step.action}</p>
                        <p><strong>Expected:</strong> {step.expectedResult}</p>
                      </div>
                    )}

                    <FormSelect
                      label="Result"
                      value={stepResult.result}
                      onChange={(e) => handleStepResultChange(index, "result", e.target.value)}
                      options={[
                        { value: "NOT_EXECUTED", label: "Not Executed" },
                        { value: "PASSED", label: "Passed" },
                        { value: "FAILED", label: "Failed" },
                        { value: "BLOCKED", label: "Blocked" },
                        { value: "SKIPPED", label: "Skipped" }
                      ]}
                    />

                    <FormInput
                      label="Actual Result"
                      value={stepResult.actualResult}
                      onChange={(e) => handleStepResultChange(index, "actualResult", e.target.value)}
                      placeholder="Enter actual result"
                    />

                    <FormInput
                      label="Comment"
                      value={stepResult.comment}
                      onChange={(e) => handleStepResultChange(index, "comment", e.target.value)}
                      placeholder="Enter comment"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
            {isLoading ? "Saving..." : execution ? "Update Execution" : "Save Execution"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
