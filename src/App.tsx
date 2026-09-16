import { useState, useMemo } from 'react';
import './App.css';
import { Agentation } from 'agentation';
import { CanopyCanvas } from './components/3d/CanopyCanvas';
import { CameraToolbar } from './components/3d/CameraToolbar';
import { ColorSelector } from './components/configurator/ColorSelector';
import { VariantSelector } from './components/configurator/VariantSelector';
import type { TentSizeId, CameraPreset } from './types/product';
import { SIZES, COLOR_OPTIONS } from './data/canopyData';
import {
  ShoppingBag,
  Download,
  CheckCircle2,
} from 'lucide-react';

const IsDev = import.meta.env.DEV

export default function App() {
  const [sizeId, setSizeId] = useState<TentSizeId>('5x5');
  const [colorId, setColorId] = useState<string>('yellow');
  const [quantity, setQuantity] = useState<number>(1);

  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('presentation');
  const [resetKey, setResetKey] = useState<number>(0);

  const handleSelectPreset = (preset: CameraPreset) => {
    setCameraPreset(preset);
    setResetKey((k) => k + 1);
  };

  const activeSize = SIZES.find((s) => s.id === sizeId) ?? SIZES[0];
  const activeColor =
    COLOR_OPTIONS.find((c) => c.id === colorId) ?? COLOR_OPTIONS[0];

  const unitPrice = activeSize.price;
  const totalPrice = useMemo(() => unitPrice * quantity, [unitPrice, quantity]);

  const formattedTotalPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalPrice);

  const formattedUnitPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(unitPrice);

  const formattedOriginalPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(unitPrice * 1.35));

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-indigo-500 selection:text-white">
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 lg:sticky lg:top-5 self-start">
            <div className="relative flex flex-col rounded-2xl border border-border/70 bg-gradient-to-b from-slate-50/70 to-white shadow-soft transition-all duration-300 dark:from-slate-900/60 dark:to-slate-900/90 h-[500px] sm:h-[560px] lg:h-[calc(100vh-2.5rem)] max-h-[780px]">
              <div className="relative flex-1">
                <CanopyCanvas
                  modelFile={activeSize.modelFile}
                  colorHex={activeColor.hex}
                  tintHex={activeColor.tintHex}
                  frameOption="with-frame"
                  totalPrice={unitPrice}
                  cameraPreset={cameraPreset}
                  resetKey={resetKey}
                />
              </div>

              <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex w-full -translate-x-1/2 justify-center px-4">
                <CameraToolbar
                  currentPreset={cameraPreset}
                  onSelectPreset={handleSelectPreset}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="rounded-xl border border-border/80 bg-slate-50/70 p-3.5 dark:bg-slate-900/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-primary dark:bg-indigo-950 dark:text-indigo-400">
                  ENTERPRISE POP-UP CANOPY
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <h1 className="text-base font-extrabold tracking-tight sm:text-lg text-slate-900 dark:text-white">
                  Commercial Pop-Up Canopy Tent
                </h1>
                <div className="flex items-baseline gap-2 shrink-0">
                  <span className="text-xl font-black tracking-tight text-primary">
                    {formattedUnitPrice}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {formattedOriginalPrice}
                  </span>
                </div>
              </div>
            </div>

            <div id="configurator" className="space-y-4">
              <ColorSelector
                selectedColorId={colorId}
                onSelectColor={(id) => setColorId(id)}
              />

              <VariantSelector
                selectedSizeId={sizeId}
                onSelectSize={(s) => setSizeId(s)}
              />
            </div>

            <div className="sticky bottom-0 z-20 rounded-xl border border-indigo-200/90 bg-white/95 p-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md dark:border-indigo-900 dark:bg-slate-900/95">
              <div className="mb-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Configured Total
                  </span>
                  <div className="text-xl font-black text-slate-900 dark:text-white">
                    {formattedTotalPrice}
                  </div>
                </div>

                <div className="flex items-center rounded-lg border border-border bg-slate-50 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      `Added ${quantity}x ${activeSize.label} Canopy (${activeColor.name}) to cart! Total: ${formattedTotalPrice}`
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-gradient px-4 py-2.5 text-xs font-bold text-white shadow-button hover:opacity-95"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add to Order</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert(
                      `Specification Sheet for ${activeSize.label} Canopy downloaded!`
                    )
                  }
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Specs</span>
                </button>
              </div>

              <div className="mt-2.5 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Free Delivery Across India
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Ready to Dispatch
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {IsDev && <Agentation />}
    </div>
  );
}
