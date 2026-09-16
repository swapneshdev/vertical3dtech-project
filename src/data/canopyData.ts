import type {
  ColorOption,
  SizeOption,
  TentSizeId,
  CanopyVariantPrice,
  SideWallOption,
  HalfWallOption,
} from '../types/product';

export const SIZES: SizeOption[] = [
  {
    id: '5x5',
    label: "5' × 5'",
    dimensions: '5ft × 5ft (1.5m × 1.5m)',
    areaSqFt: 25,
    modelFile: '/glb/Tent_5_5.draco.glb',
    scale: [1, 1, 1],
    price: 6550,
  },
  {
    id: '6.5x6.5',
    label: "6.5' × 6.5'",
    dimensions: '6.5ft × 6.5ft (2.0m × 2.0m)',
    areaSqFt: 42.25,
    modelFile: '/glb/Tent_6_5_6_5.draco.glb',
    scale: [1, 1, 1],
    price: 8950,
  },
  {
    id: '8x8',
    label: "8' × 8'",
    dimensions: '8ft × 8ft (2.4m × 2.4m)',
    areaSqFt: 64,
    modelFile: '/glb/Tent_8_8.draco.glb',
    scale: [1, 1, 1],
    price: 11500,
  },
];

export const BASE_PRICES: Record<TentSizeId, CanopyVariantPrice> = {
  '5x5': {
    withFrame: 6550,
    noFrame: 4250,
  },
  '6.5x6.5': {
    withFrame: 8950,
    noFrame: 5800,
  },
  '8x8': {
    withFrame: 11500,
    noFrame: 7450,
  },
};

export const COLOR_OPTIONS: ColorOption[] = [
  {
    id: 'yellow',
    name: 'Golden Yellow',
    hex: '#FBBF24',
    tintHex: '#FFFFFF', // Preserves 100% authentic original GLB model texture
    description: 'Original signature golden yellow as manufactured',
    category: 'Signature',
    isDefault: true,
  },
  {
    id: 'navy',
    name: 'Navy Classic',
    hex: '#0F2942',
    description: 'Deep nautical navy, inspired by classic luxury enterprise aesthetic',
    category: 'Classic',
  },
  {
    id: 'indigo',
    name: 'Corporate Indigo',
    hex: '#4F46E5',
    description: 'Vibrant signature Indigo 600 from our Corporate Trust design system',
    category: 'Signature',
  },
  {
    id: 'emerald',
    name: 'Forest Emerald',
    hex: '#065F46',
    description: 'Rich organic evergreen tone for outdoor and garden events',
    category: 'Classic',
  },
  {
    id: 'crimson',
    name: 'Crimson Red',
    hex: '#DC2626',
    description: 'High-visibility vibrant red for tradeshows and brand awareness',
    category: 'Accent',
  },
  {
    id: 'slate',
    name: 'Graphite Slate',
    hex: '#334155',
    description: 'Sophisticated modern dark neutral for premium exhibitions',
    category: 'Classic',
  },
];

export interface WallChoice<T> {
  id: T;
  label: string;
  price: number;
}

export const SIDE_WALLS: WallChoice<SideWallOption>[] = [
  { id: 'none', label: 'None', price: 0 },
  { id: '1-single', label: '(1) 10ft Side Wall: Single Sided Print', price: 1250 },
  { id: '3-single', label: '(3) 10ft Side Walls: Single Sided Print', price: 3400 },
  { id: '1-double', label: '(1) 10ft Side Wall: Double Sided Print', price: 1850 },
  { id: '3-double', label: '(3) 10ft Side Walls: Double Sided Print', price: 4950 },
];

export const HALF_WALLS: WallChoice<HalfWallOption>[] = [
  { id: 'none', label: 'None', price: 0 },
  { id: 'half-single', label: 'Half Walls (Set of 2): Single Sided Print', price: 1600 },
  { id: 'half-double', label: 'Half Walls (Set of 2): Double Sided Print', price: 2450 },
];

export const PRODUCT_SPECS = [
  { label: 'Frame Construction', value: '40mm Commercial Hexagonal Anodized Aluminum' },
  { label: 'Canopy Fabric', value: '600D High-Density Polyester with PU Undercoating' },
  { label: 'Weather Protection', value: '100% Waterproof, 3000mm Hydrostatic Head Rating' },
  { label: 'Fire & Safety Certifications', value: 'CPAI-84 & NFPA-701 Flame Retardant Certified' },
  { label: 'UV Resistance', value: 'UPF 50+ Maximum Solar Protection Rating' },
  { label: 'Rapid Deployment', value: 'Sub-60s tool-free pitch with pinch-proof thumb latches' },
  { label: 'Warranty & Support', value: '3-Year Limited Commercial Warranty' },
];

export function calculateTotalPrice(
  sizeId: TentSizeId,
  quantity = 1,
  frameOption: 'with-frame' | 'no-frame' = 'with-frame',
  sideWallOption: SideWallOption = 'none',
  halfWallOption: HalfWallOption = 'none'
): number {
  const size = SIZES.find((s) => s.id === sizeId) ?? SIZES[0];
  const base = frameOption === 'with-frame' ? size.price : (BASE_PRICES[sizeId]?.noFrame ?? size.price);
  const sideWallCost = SIDE_WALLS.find((w) => w.id === sideWallOption)?.price ?? 0;
  const halfWallCost = HALF_WALLS.find((w) => w.id === halfWallOption)?.price ?? 0;
  return (base + sideWallCost + halfWallCost) * quantity;
}
