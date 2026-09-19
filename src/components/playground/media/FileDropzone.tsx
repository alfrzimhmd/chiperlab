import { useCallback, useRef, useState } from 'react';
import { Upload, FileWarning, X } from 'lucide-react';

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  onClear?: () => void;
  selectedFile: File | null;
  maxSizeMB?: number;
  accept?: string;
  disabled?: boolean;
}

const MAX_SIZE_DEFAULT_MB = 20;

export function FileDropzone({
  onFileSelected,
  onClear,
  selectedFile,
  maxSizeMB = MAX_SIZE_DEFAULT_MB,
  accept,
  disabled = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxBytes = maxSizeMB * 1024 * 1024;

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (file.size > maxBytes) {
        setError(
          `File is too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum ${maxSizeMB} MB allowed.`
        );
        return;
      }
      if (file.size === 0) {
        setError('Empty file is not allowed.');
        return;
      }
      onFileSelected(file);
    },
    [maxBytes, maxSizeMB, onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = '';
    },
    [handleFile]
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onClear?.();
  };

  return (
    <div className="space-y-2">
      <div
        onDragEnter={e => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragOver={e => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={e => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 p-8 sm:p-10 rounded-2xl border-2 border-dashed transition-all duration-200 ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-[var(--border-main)] bg-[var(--surface-secondary)]'
            : isDragging
            ? 'border-cyan-500/60 bg-cyan-500/5 cursor-pointer scale-[1.01]'
            : 'border-[var(--border-main)] bg-[var(--surface-secondary)] hover:border-cyan-500/40 hover:bg-[var(--surface-secondary)]/70 cursor-pointer'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Upload className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)] break-all">
                {selectedFile.name}
              </p>
              <p className="text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
                {(selectedFile.size / 1024).toFixed(2)} KB · {selectedFile.type || 'unknown'}
              </p>
            </div>
            <p className="text-[10px] font-mono text-cyan-400 mt-1">
              Click to replace · or drop a new file
            </p>
            {onClear && (
              <button
                type="button"
                onClick={handleClear}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--surface-main)] border border-[var(--border-main)] text-[10px] font-mono font-semibold text-[var(--text-secondary)] hover:text-rose-400 hover:border-rose-500/40 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" /> Clear file
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Upload className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Drag & drop your file here
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                or click to browse · Max {maxSizeMB} MB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
          <FileWarning className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="text-xs text-[var(--text-secondary)] leading-relaxed">{error}</span>
        </div>
      )}
    </div>
  );
}