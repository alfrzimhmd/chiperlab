import { useEffect, useState } from 'react';
import {
  FileText,
  FileImage,
  FileAudio,
  FileVideo,
  FileArchive,
  FileCode,
  File as FileIconGeneric,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { formatBytes } from '../../../crypto/media/fileEncryption';

interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  showPreview?: boolean;
}

type FileCategory = 'image' | 'audio' | 'video' | 'pdf' | 'archive' | 'code' | 'text' | 'other';

function categorizeFile(file: File): FileCategory {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('audio/')) return 'audio';
  if (type.startsWith('video/')) return 'video';
  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (
    type.includes('zip') ||
    type.includes('rar') ||
    type.includes('7z') ||
    type.includes('tar') ||
    type.includes('gzip')
  )
    return 'archive';
  if (
    type.includes('javascript') ||
    type.includes('json') ||
    type.includes('xml') ||
    type.includes('html') ||
    type.includes('css') ||
    name.endsWith('.ts') ||
    name.endsWith('.tsx') ||
    name.endsWith('.js') ||
    name.endsWith('.py')
  )
    return 'code';
  if (type.startsWith('text/')) return 'text';
  return 'other';
}

const CATEGORY_CONFIG: Record<
  FileCategory,
  { Icon: typeof FileText; color: string; bg: string; border: string; label: string }
> = {
  image: {
    Icon: FileImage,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    label: 'Image',
  },
  audio: {
    Icon: FileAudio,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    label: 'Audio',
  },
  video: {
    Icon: FileVideo,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    label: 'Video',
  },
  pdf: {
    Icon: FileText,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    label: 'PDF',
  },
  archive: {
    Icon: FileArchive,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    label: 'Archive',
  },
  code: {
    Icon: FileCode,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    label: 'Code',
  },
  text: {
    Icon: FileText,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    label: 'Text',
  },
  other: {
    Icon: FileIconGeneric,
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    label: 'File',
  },
};

export function FilePreview({ file, onRemove, showPreview = true }: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(showPreview);

  const category = categorizeFile(file);
  const config = CATEGORY_CONFIG[category];
  const CategoryIcon = config.Icon;

  // Create preview URL for images
  useEffect(() => {
    if (category === 'image' && showImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file, category, showImage]);

  return (
    <div className="p-5 rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] shadow-lg space-y-4">
      <div className="flex items-start gap-4">
        {/* Icon / Thumbnail */}
        {previewUrl ? (
          <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-[var(--border-main)] bg-[var(--surface-secondary)]">
            <img
              src={previewUrl}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            className={`shrink-0 w-20 h-20 rounded-xl border flex items-center justify-center ${config.bg} ${config.border} ${config.color}`}
          >
            <CategoryIcon className="w-8 h-8" strokeWidth={2} />
          </div>
        )}

        {/* Metadata */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[var(--text-primary)] break-all leading-tight">
                {file.name}
              </h3>
              <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-1">
                {config.label} · {file.type || 'unknown/unknown'}
              </p>
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="shrink-0 w-7 h-7 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-400 transition-colors cursor-pointer"
                aria-label="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="p-2.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block">
                Size
              </span>
              <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                {formatBytes(file.size)}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-main)]">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block">
                Last Modified
              </span>
              <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Toggle */}
      {category === 'image' && previewUrl && (
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-main)]">
          <span className="text-[10px] font-mono text-[var(--text-secondary)]">
            Image preview available
          </span>
          <button
            type="button"
            onClick={() => setShowImage(prev => !prev)}
            className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            {showImage ? (
              <>
                <EyeOff className="w-3 h-3" /> Hide preview
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" /> Show preview
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}