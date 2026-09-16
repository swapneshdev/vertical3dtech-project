import { Html } from '@react-three/drei';

interface PriceAnnotationProps {
  price: number;
  position?: [number, number, number];
}

export function PriceAnnotation({
  price,
  position = [1.1, 1.1, 0.2],
}: PriceAnnotationProps) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Html
      position={position}
      center
      zIndexRange={[100, 0]}
      style={{ pointerEvents: 'auto', userSelect: 'none' }}
    >
      <div className="flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-100/90 px-3 py-1 shadow-[0_4px_16px_0_rgba(79,70,229,0.25)] backdrop-blur-md whitespace-nowrap">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
        </span>
        <span className="text-sm font-bold tracking-tight text-indigo-700">
          {formattedPrice}
        </span>
      </div>
    </Html>
  );
}
