"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import Modal from "../common/Modal";
import FormInput from "../common/FormInput";
import { useUpsertTestCaseMutation } from "@/app/redux/api/TestCaseApiSlice";
import { useGetRequirementsByProjectQuery } from "@/app/redux/api/RequirementApiSlice";
import toast from "react-hot-toast";

/**
 * Test Case Create/Edit Modal
 * Backend DTO: TestCaseDto
 */
export default function TestCaseModal({ isOpen, onClose, projectId, testCase = null }) {
  const [formData, setFormData] = useState({
    tcNumber: "",
    title: "",
    appRef: "",
    preConditions: "",
    postConditions: "",
    frId: "",
    steps: []
  });

  const [upsertTestCase, { isLoading }] = useUpsertTestCaseMutation();
  const { data: requirements = [] } = useGetRequirementsByProjectQuery(projectId, {
    skip: !projectId
  });

  useEffect(() => {
    if (testCase) {
      setFormData({
        tcNumber: testCase.tcNumber || "",
        title: testCase.title || "",
        appRef: testCase.appRef || "",
        preConditions: testCase.preConditions || "",
        postConditions: testCase.postConditions || "",
        frId: testCase.frId || "",
        steps: testCase.steps || []
      });
    } else {
      setFormData({
        tcNumber: "",
        title: "",
        appRef: "",
        preConditions: "",
        postConditions: "",
        frId: "",
        steps: []
      });
    }
  }, [testCase, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        { stepOrder: prev.steps.length + 1, action: "", expectedResult: "", testData: "" }
      ]
    }));
  };

  const handleStepChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };

  const handleRemoveStep = (index) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index).map((step, i) => ({
        ...step,
        stepOrder: i + 1
      }))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        id: testCase?.id || null,
        projectId,
        frId: formData.frId || null,
        tcNumber: formData.tcNumber,
        title: formData.title,
        appRef: formData.appRef || null,
        preConditions: formData.preConditions || null,
        postConditions: formData.postConditions || null,
        steps: formData.steps.map((step, index) => ({
          id: step.id || null,
          stepOrder: index + 1,
          action: step.action,
          expectedResult: step.expectedResult,
          testData: step.testData || null
        }))
      };

      await upsertTestCase(payload).unwrap();
      toast.success(testCase ? "Test case updated successfully" : "Test case created successfully");
      onClose();
    } catch (error) {
      console.error("Error saving test case:", error);
      toast.error(error.data?.message || "Failed to save test case");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={testCase ? "Edit Test Case" : "Create Test Case"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="TC Number"
            name="tcNumber"
            value={formData.tcNumber}
            onChange={handleChange}
            required
            maxLength={20}
            placeholder="TC-001"
          />
          
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Requirement
            </label>
            <select
              name="frId"
              value={formData.frId}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 text-sm border-2 border-zinc-200 bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 outline-none"
            >
              <option value="">No Requirement</option>
              {requirements.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.frRefCode} - {req.description?.substring(0, 50)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <FormInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={255}
          placeholder="Enter test case title"
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
          label="Pre-conditions"
          name="preConditions"
          type="textarea"
          value={formData.preConditions}
          onChange={handleChange}
          rows={3}
          placeholder="Enter pre-conditions"
        />

        <FormInput
          label="Post-conditions"
          name="postConditions"
          type="textarea"
          value={formData.postConditions}
          onChange={handleChange}
          rows={3}
          placeholder="Enter post-conditions"
        />

        {/* Test Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">Test Steps</h3>
            <button
              type="button"
              onClick={handleAddStep}
              className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold flex items-center gap-1 hover:bg-[#5851e6] transition-all"
            >
              <Plus size={14} /> Add Step
            </button>
          </div>

          {formData.steps.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              No steps added yet. Click "Add Step" to create test steps.
            </div>
          ) : (
            <div className="space-y-4">
              {formData.steps.map((step, index) => (
                <div key={index} className="p-4 border-2 border-zinc-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-600">Step {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <FormInput
                    label="Action"
                    value={step.action}
                    onChange={(e) => handleStepChange(index, "action", e.target.value)}
                    required
                    maxLength={1200}
                    placeholder="Describe the action to perform"
                  />

                  <FormInput
                    label="Expected Result"
                    value={step.expectedResult}
                    onChange={(e) => handleStepChange(index, "expectedResult", e.target.value)}
                    required
                    maxLength={1200}
                    placeholder="Describe the expected result"
                  />

                  <FormInput
                    label="Test Data (Optional)"
                    value={step.testData}
                    onChange={(e) => handleStepChange(index, "testData", e.target.value)}
                    placeholder="Enter test data if needed"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
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
            {isLoading ? "Saving..." : testCase ? "Update Test Case" : "Create Test Case"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
