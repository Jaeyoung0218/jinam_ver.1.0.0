export type LockerPoint = {
  id: string;
  name: string;
  type: "locker";
  lat: number;
  lng: number;
  station: string;
  status: "safe" | "normal" | "busy" | "full";
};

export type RestaurantPoint = {
  id: string;
  name: string;
  type: "food";
  lat: number;
  lng: number;
  tags: string[];
  isTaiwanFriendly: boolean;
};

export const lockers: LockerPoint[] = [
  { id: "locker-1", name: "Olympic Park Station A", type: "locker", lat: 37.5164, lng: 127.1229, station: "Olympic Park", status: "safe" },
  { id: "locker-2", name: "Mongchontoseong Station B", type: "locker", lat: 37.5172, lng: 127.1127, station: "Mongchontoseong", status: "normal" },
  { id: "locker-3", name: "Jamsil Station C", type: "locker", lat: 37.5133, lng: 127.1001, station: "Jamsil", status: "busy" },
];

export const restaurants: RestaurantPoint[] = [
  { id: "food-1", name: "Bangyi BBQ", type: "food", lat: 37.5147, lng: 127.1222, tags: ["BBQ", "Late-night"], isTaiwanFriendly: true },
  { id: "food-2", name: "Songpa Noodles", type: "food", lat: 37.5128, lng: 127.1189, tags: ["Noodles", "Quick"], isTaiwanFriendly: false },
  { id: "food-3", name: "Taiwan Choice Cafe", type: "food", lat: 37.5155, lng: 127.1203, tags: ["Cafe", "Dessert"], isTaiwanFriendly: true },
];
