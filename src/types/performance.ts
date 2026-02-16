export type PerformanceStatus = "scheduled" | "ongoing" | "finished" | "archived" | "draft";

export type Venue = {
  id: string;
  slug: "kspo-dome" | "handball" | "olympic-hall";
  name_ko: string;
  name_zh_tw: string;
};

export type TicketLink = {
  id: string;
  provider: "WorldNol" | "YES24";
  url: string;
  is_global: boolean;
};

export type Performance = {
  id: string;
  title_ko: string;
  title_zh_tw: string | null;
  artist_name: string | null;
  start_date: string;
  end_date: string | null;
  venue_id: string;
  poster_url: string | null;
  status: PerformanceStatus;
  venue?: Venue;
  ticket_links?: TicketLink[];
};

export type GroupedPerformances = {
  venue: Venue;
  items: (Performance & { d_day: number })[];
}[];
