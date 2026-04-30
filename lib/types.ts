export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  phone: string;
  avgPrice: string;
  imageUrl: string;
  dianpingUrl: string;
  tags: string[];
  note: string;
  rating: number;
  latitude: number;
  longitude: number;
  lastVisitedAt?: string;
};
