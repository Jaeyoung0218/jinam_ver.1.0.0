export type SupportedLocale = "ko" | "tw";

export type Concert = {
  id: string;
  title: { ko: string; zh: string };
  artist: string;
  venue: { name: string; room: string };
  date: { start: string; end: string; time: string };
  images: { poster: string };
  links: { global?: string; kr?: string; lineChat?: string };
  category: "concert" | "fanmeeting";
};
