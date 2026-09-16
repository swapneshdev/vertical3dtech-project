import type {
  TentSizeId,
  FrameOption,
  SideWallOption,
  HalfWallOption,
} from '../../types/product';
import { SIZES } from '../../data/canopyData';

interface VariantSelectorProps {
  selectedSizeId: TentSizeId;
  onSelectSize: (sizeId: TentSizeId) => void;
  selectedFrameOption?: FrameOption;
  onSelectFrameOption?: (option: FrameOption) => void;
  selectedSideWallOption?: SideWallOption;
  onSelectSideWallOption?: (option: SideWallOption) => void;
  selectedHalfWallOption?: HalfWallOption;
  onSelectHalfWallOption?: (option: HalfWallOption) => void;
}

export function VariantSelector({
  selectedSizeId,
  onSelectSize,
}: VariantSelectorProps) {
  const activeSize = SIZES.find((s) => s.id === selectedSizeId) ?? SIZES[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-white">
          CANOPY SIZE (3D MODEL)
        </label>
        <span className="text-[11px] font-semibold text-primary">
          {activeSize.dimensions}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {SIZES.map((size) => {
          const isSelected = selectedSizeId === size.id;
          return (
            <button
              key={size.id}
              type="button"
              onClick={() => onSelectSize(size.id)}
              className={`group flex flex-col items-center justify-center rounded-xl border p-2 text-center transition-all duration-150 ${
                isSelected
                  ? 'border-2 border-primary bg-indigo-50/60 shadow-xs dark:border-indigo-400 dark:bg-indigo-950/40'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <span
                className={`text-xs font-extrabold ${
                  isSelected
                    ? 'text-primary dark:text-indigo-400'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {size.label}
              </span>
              <span className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                {size.areaSqFt} sq ft
              </span>
              <span
                className={`mt-1 text-xs font-bold ${
                  isSelected
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                ₹{size.price.toLocaleString('en-IN')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
