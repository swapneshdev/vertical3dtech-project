import { COLOR_OPTIONS } from '../../data/canopyData';

interface ColorSelectorProps {
  selectedColorId: string;
  onSelectColor: (colorId: string) => void;
}

export function ColorSelector({
  selectedColorId,
  onSelectColor,
}: ColorSelectorProps) {
  const activeColor =
    COLOR_OPTIONS.find((c) => c.id === selectedColorId) ?? COLOR_OPTIONS[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
          CANOPY COLOR
        </label>
        <span className="text-[11px] font-semibold text-primary">
          {activeColor.name}
        </span>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {COLOR_OPTIONS.map((color) => {
          const isSelected = color.id === selectedColorId;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelectColor(color.id)}
              className="group relative flex flex-col items-center focus:outline-none"
              title={`${color.name} - ${color.description}`}
            >
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                  isSelected
                    ? 'ring-2 ring-primary ring-offset-2 shadow-xs dark:ring-offset-slate-900'
                    : 'hover:ring-2 hover:ring-slate-300 dark:hover:ring-slate-600'
                }`}
                style={{ backgroundColor: color.hex }}
              />
              <span className="mt-1 hidden truncate text-[10px] font-medium text-slate-600 sm:block dark:text-slate-400">
                {color.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
