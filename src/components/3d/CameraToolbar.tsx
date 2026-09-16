import type { CameraPreset } from '../../types/product';
import {
  Eye,
  ArrowUp,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpLeft,
  MoveHorizontal,
  Sparkles,
} from 'lucide-react';

interface CameraToolbarProps {
  currentPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
}

export function CameraToolbar({
  currentPreset,
  onSelectPreset,
}: CameraToolbarProps) {
  const presets: {
    id: CameraPreset;
    label: string;
    tooltip: string;
    icon: React.ReactNode;
    isPresentation?: boolean;
  }[] = [
    {
      id: 'presentation',
      label: 'Presentation',
      tooltip: 'Presentation View (Interactive 3D Orbit)',
      icon: <Sparkles className="h-3.5 w-3.5" />,
      isPresentation: true,
    },
    {
      id: 'top',
      label: 'Top',
      tooltip: 'Top View (Overhead Roof Inspection)',
      icon: <ArrowUp className="h-3.5 w-3.5" />,
    },
    {
      id: 'top-left',
      label: 'Top Left',
      tooltip: 'Top-Left Isometric 3D Angle',
      icon: <ArrowUpLeft className="h-3.5 w-3.5" />,
    },
    {
      id: 'bottom-left',
      label: 'Bottom Left',
      tooltip: 'Bottom-Left View (Low Under-Canopy Angle)',
      icon: <ArrowDownLeft className="h-3.5 w-3.5" />,
    },
    {
      id: 'bottom-right',
      label: 'Bottom Right',
      tooltip: 'Bottom-Right View (Low Under-Canopy Angle)',
      icon: <ArrowDownRight className="h-3.5 w-3.5" />,
    },
    {
      id: 'front',
      label: 'Front',
      tooltip: 'Front Elevation View',
      icon: <Eye className="h-3.5 w-3.5" />,
    },
    {
      id: 'side',
      label: 'Side',
      tooltip: 'Side Profile View',
      icon: <MoveHorizontal className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-slate-200/90 bg-white/92 p-1.5 shadow-[0_10px_35px_-5px_rgba(79,70,229,0.18),0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all dark:border-slate-800/90 dark:bg-slate-900/92 dark:shadow-[0_10px_35px_-5px_rgba(0,0,0,0.5)] max-w-[calc(100vw-2.5rem)] sm:max-w-none overflow-x-auto no-scrollbar">
      {presets.map((preset) => {
        const isActive = currentPreset === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 shrink-0 ${
              isActive
                ? preset.isPresentation
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-primary shadow-xs dark:bg-slate-950 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800'
            }`}
            title={preset.tooltip}
          >
            {preset.icon}
            <span className="text-[11px] font-bold tracking-tight whitespace-nowrap">
              {preset.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
