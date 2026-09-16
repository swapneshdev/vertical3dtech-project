export type TentSizeId = '5x5' | '6.5x6.5' | '8x8';

export type FrameOption = 'with-frame' | 'no-frame';

export type SideWallOption =
  | 'none'
  | '1-single'
  | '3-single'
  | '1-double'
  | '3-double';

export type HalfWallOption =
  | 'none'
  | 'half-single'
  | 'half-double';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  tintHex?: string;
  description: string;
  category: 'Classic' | 'Signature' | 'Accent';
  isDefault?: boolean;
}

export interface SizeOption {
  id: TentSizeId;
  label: string;
  dimensions: string;
  areaSqFt: number;
  modelFile: string;
  scale: [number, number, number];
  price: number;
}

export interface CanopyVariantPrice {
  withFrame: number;
  noFrame: number;
}

export type CameraPreset =
  | 'presentation'
  | 'top'
  | 'top-left'
  | 'bottom-left'
  | 'bottom-right'
  | 'front'
  | 'side'
  | 'bottom';

export interface ProductConfiguration {
  sizeId: TentSizeId;
  frameOption: FrameOption;
  colorId: string;
  sideWallOption: SideWallOption;
  halfWallOption: HalfWallOption;
  quantity: number;
}
