
export interface PositionData {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  scale?: string;
  rotation?: string;
  zIndex?: number;
  angleX?: string;
  angleY?: string;
  angleZ?: string;
  rotationAxis?: 'x' | 'y' | 'z';
}

export interface Model {
  id: string;
  name: string;
  description: string;
  model_url: string;
  is_featured: boolean;
  position?: string;
  position_data?: PositionData;
}

export interface SupabaseModel {
  name: string;
  description?: string;
  model_url: string;
  is_featured?: boolean;
  position?: string;
}

export interface PublicFigure {
  id: string;
  name: string;
  subtitle?: string;
  description?: string;
  imageurl: string;
  video_url?: string;
  order?: number;
}
