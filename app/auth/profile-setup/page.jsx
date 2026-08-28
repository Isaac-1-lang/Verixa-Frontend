"use client";

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, User, ArrowRight, CheckCircle, X, ImagePlus, Sparkles, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// ─── Confirmation Modal ────────────────────────────────────────────────────
function ConfirmModal({ preview, fileName, onConfirm, onCancel, isUploading }) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(11,17,33,0.7)', backdropFilter: 'blur(6px)' }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          {/* Modal header */}
          <div className="bg-navy px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <CheckCircle size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-base">Confirm Photo</span>
            </div>
            <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Preview */}
          <div className="p-6 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-navy/10 shadow-xl">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow">
                <CheckCircle size={14} className="text-white" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold text-navy text-sm">{fileName}</p>
              <p className="text-navy/40 text-xs mt-1">This will be your profile picture</p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onCancel}
              disabled={isUploading}
              className="flex-1 py-3 rounded-xl border border-navy/10 text-navy/60 font-semibold text-sm hover:bg-navy/5 transition-all disabled:opacity-40"
            >
              Choose Different
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onConfirm}
              disabled={isUploading}
              className="flex-1 py-3 rounded-xl bg-navy text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-navy/20 disabled:opacity-60"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Upload size={15} />
                  Upload
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Success Modal ─────────────────────────────────────────────────────────
function SuccessModal({ onContinue }) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(11,17,33,0.7)', backdropFilter: 'blur(6px)' }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center"
        >
          <div className="bg-linear-to-br from-emerald-500 to-emerald-600 px-6 py-8 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3"
            >
              <CheckCircle size={36} className="text-white" />
            </motion.div>
            <h3 className="text-white font-black text-xl">Profile Updated!</h3>
            <p className="text-white/80 text-sm mt-1">Your photo has been saved successfully.</p>
          </div>
          <div className="p-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
              className="w-full py-3 bg-navy text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-navy/20"
            >
              Go to Dashboard <ArrowRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ProfileSetupPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File size must be less than 5MB'); return; }
    setError('');
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => { setPreview(reader.result); setShowConfirm(true); };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => processFile(e.target.files[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleUpload = async () => {
    if (!selectedFile) return;
    const token = localStorage.getItem('token');
    if (!token) { setError('Session expired. Please log in again.'); router.push('/auth/login'); return; }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8086';
      const res = await fetch(`${apiUrl}/api/dashboard/profile/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || `Upload failed (${res.status})`);

      setShowConfirm(false);
      setShowSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to upload profile picture');
      setShowConfirm(false);
    } finally {
      setIsUploading(false);
    }
  };

  const steps = [
    { label: 'Create Account', done: true },
    { label: 'Profile Photo', done: false, active: true },
    { label: 'Dashboard', done: false },
  ];

  return (
    <>
      {/* Modals */}
      {showConfirm && (
        <ConfirmModal
          preview={preview}
          fileName={selectedFile?.name}
          onConfirm={handleUpload}
          onCancel={() => { setShowConfirm(false); setPreview(null); setSelectedFile(null); }}
          isUploading={isUploading}
        />
      )}
      {showSuccess && <SuccessModal onContinue={() => router.push('/dashboard')} />}

      <div className="min-h-screen flex bg-white">
        {/* ── Left Panel ── */}
        <div className="hidden lg:flex lg:w-[55%] bg-navy flex-col justify-between p-10 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/0.03 border border-white/5" />
          <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full bg-white/0.03 border border-white/5" />
          <div className="absolute -bottom-16 left-1/2 w-56 h-56 rounded-full bg-white/0.03 border border-white/5" />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 relative z-10"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
              <img src="/logo.png" alt="Verixa" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">VERIXA</span>
          </motion.div>

          {/* Center content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative z-10"
          >
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Make your<br />profile shine.
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-xs">
              A profile picture helps teammates recognize you instantly and makes collaboration feel more personal.
            </p>

            {/* Feature list */}
            <ul className="mt-8 space-y-3">
              {[
                { icon: Shield, text: 'Your photo is stored securely' },
                { icon: User, text: 'Visible only to your team members' },
                { icon: ImagePlus, text: 'Can be changed anytime in settings' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-white/70" />
                  </div>
                  <span className="text-white/60 text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Steps progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 flex items-center gap-2"
          >
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${step.active ? 'opacity-100' : step.done ? 'opacity-70' : 'opacity-30'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${step.done ? 'bg-emerald-500 border-emerald-500 text-white' :
                      step.active ? 'bg-white border-white text-navy' :
                        'border-white/30 text-white/30'
                    }`}>
                    {step.done ? <CheckCircle size={12} /> : i + 1}
                  </div>
                  <span className={`text-xs font-semibold ${step.active ? 'text-white' : 'text-white/40'}`}>
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-6 h-px bg-white/15 mx-1" />
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
          {/* Subtle background */}
          <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-navy opacity-[0.02] rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-[440px] relative z-10"
          >
            {/* Mobile logo */}
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
              <img src="/logo.png" alt="Verixa" className="w-8 h-8 object-contain" />
              <span className="font-bold text-navy text-xl">VERIXA</span>
            </Link>

            {/* Heading */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-navy leading-tight mb-2">
                Set Your Photo
              </h1>
              <p className="text-navy/40 font-medium text-base">
                Upload a profile picture to personalize your workspace.
              </p>
              <div className="h-1 w-10 bg-navy rounded-full mt-4" />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-semibold flex items-center gap-2"
                >
                  <X size={16} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Zone */}
            <motion.div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              whileHover={{ scale: 1.005 }}
              className={`relative w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden mb-8 ${isDragging
                  ? 'border-navy bg-navy/5 scale-[1.01]'
                  : preview
                    ? 'border-emerald-400/40 bg-emerald-50/30'
                    : 'border-navy/10 bg-navy/0.015 hover:border-navy/30 hover:bg-navy/0.03'
                }`}
              style={{ minHeight: '240px' }}
            >
              <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
                {preview ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                        <CheckCircle size={13} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-navy text-sm">{selectedFile?.name}</p>
                      <p className="text-navy/40 text-xs mt-1">Click to choose a different photo</p>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      animate={isDragging ? { scale: 1.2 } : { scale: 1 }}
                      className="w-16 h-16 rounded-2xl bg-navy/5 border border-navy/8 flex items-center justify-center mb-4"
                    >
                      <ImagePlus size={28} className="text-navy/30" />
                    </motion.div>
                    <p className="font-bold text-navy text-sm mb-1">
                      {isDragging ? 'Drop your photo here' : 'Drop your photo here'}
                    </p>
                    <p className="text-navy/40 text-xs mb-4">or click to browse from your device</p>
                    <div className="inline-flex items-center gap-1.5 bg-navy/5 border border-navy/8 rounded-full px-4 py-1.5">
                      <Upload size={12} className="text-navy/40" />
                      <span className="text-navy/50 text-xs font-semibold">JPG, PNG, GIF · Max 5MB</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Actions */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#131B34' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="cursor-pointer w-full h-[54px] bg-navy text-white rounded-xl font-bold text-sm shadow-2xl shadow-navy/20 flex items-center justify-center gap-3 transition-all"
              >
                <ImagePlus size={18} />
                {preview ? 'Choose Different Photo' : 'Select Photo'}
              </motion.button>

              <button
                onClick={() => router.push('/dashboard')}
                disabled={isUploading}
                className="cursor-pointer w-full h-[54px] rounded-xl font-bold text-sm text-navy/40 hover:text-navy hover:bg-navy/5 transition-all flex items-center justify-center gap-2 border border-transparent hover:border-navy/8"
              >
                Skip for now <ArrowRight size={16} />
              </button>
            </div>

            <p className="text-center text-xs text-navy/20 mt-8 font-medium">
              You can update your profile photo anytime from account settings.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
