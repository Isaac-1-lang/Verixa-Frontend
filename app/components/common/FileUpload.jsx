"use client";
import { useState, useRef } from 'react';
import { Upload, X, FileText, File, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * FileUpload Component
 * Supports Excel, CSV, PDF, and TXT files with validation
 */
export default function FileUpload({
  onFileUpload,
  acceptedTypes = ['.xlsx', '.xls', '.csv', '.pdf', '.txt'],
  maxSizeMB = 10,
  label = "Upload File",
  description = "Drag and drop or click to browse",
  multiple = false,
  disabled = false
}) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_SIZE_BYTES = maxSizeMB * 1024 * 1024;

  // File type validation
  const isValidFileType = (file) => {
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    return acceptedTypes.includes(extension);
  };

  // File size validation
  const isValidFileSize = (file) => {
    return file.size <= MAX_SIZE_BYTES;
  };

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconProps = { size: 20, className: "text-navy" };
    
    if (['xlsx', 'xls', 'csv'].includes(extension)) {
      return <FileText {...iconProps} className="text-emerald-600" />;
    } else if (extension === 'pdf') {
      return <FileText {...iconProps} className="text-red-600" />;
    } else if (extension === 'txt') {
      return <File {...iconProps} className="text-blue-600" />;
    }
    return <File {...iconProps} />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle file selection
  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    const validFiles = [];
    const errors = [];

    fileArray.forEach(file => {
      // Validate file type
      if (!isValidFileType(file)) {
        errors.push(`${file.name}: Invalid file type. Accepted: ${acceptedTypes.join(', ')}`);
        return;
      }

      // Validate file size
      if (!isValidFileSize(file)) {
        errors.push(`${file.name}: File too large. Max size: ${maxSizeMB}MB`);
        return;
      }

      // Check for duplicate names
      const isDuplicate = files.some(f => f.name === file.name);
      if (isDuplicate) {
        errors.push(`${file.name}: File already added`);
        return;
      }

      validFiles.push(file);
    });

    // Show errors
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error, { duration: 5000 }));
    }

    // Add valid files
    if (validFiles.length > 0) {
      if (multiple) {
        setFiles(prev => [...prev, ...validFiles]);
      } else {
        setFiles(validFiles);
      }
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  };

  // Handle file input change
  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  // Remove file
  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  // Upload files
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setUploading(true);
    
    try {
      // Process files
      const fileData = await Promise.all(
        files.map(async (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
              resolve({
                name: file.name,
                size: file.size,
                type: file.type,
                extension: file.name.split('.').pop().toLowerCase(),
                content: e.target.result,
                lastModified: file.lastModified
              });
            };
            
            reader.onerror = () => {
              reject(new Error(`Failed to read ${file.name}`));
            };
            
            // Read as base64 for upload
            reader.readAsDataURL(file);
          });
        })
      );

      // Call parent callback with processed files
      if (onFileUpload) {
        await onFileUpload(fileData);
      }

      toast.success('Files uploaded successfully!');
      setFiles([]);
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <label className="block text-sm font-bold text-navy mb-2">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300
          ${isDragging 
            ? 'border-navy bg-navy/5 scale-[1.02]' 
            : 'border-navy/20 bg-white hover:border-navy/40 hover:bg-navy/2'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${files.length > 0 ? 'border-emerald-500/50 bg-emerald-50/30' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDragging ? 'bg-navy text-white' : 'bg-navy/5 text-navy'}
            transition-all duration-300
          `}>
            <Upload size={28} />
          </div>

          <div>
            <p className="text-base font-bold text-navy mb-1">
              {isDragging ? 'Drop files here' : description}
            </p>
            <p className="text-sm text-navy/40">
              Accepted: {acceptedTypes.join(', ')} • Max {maxSizeMB}MB
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-bold text-navy/60">
            Selected Files ({files.length})
          </p>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white border border-navy/10 rounded-lg hover:border-navy/20 transition-all group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-navy truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-navy/40">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  className="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg transition-colors text-navy/40 hover:text-red-600 disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading || disabled}
          className="w-full bg-navy text-white py-4 px-6 rounded-xl font-bold text-base hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload {files.length} File{files.length > 1 ? 's' : ''}
            </>
          )}
        </button>
      )}

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-bold mb-1">File Upload Guidelines:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>Supported formats: Excel (.xlsx, .xls), CSV, PDF, Text (.txt)</li>
            <li>Maximum file size: {maxSizeMB}MB per file</li>
            <li>Ensure your file contains proper headers and data structure</li>
            <li>Special characters and Unicode are supported</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
