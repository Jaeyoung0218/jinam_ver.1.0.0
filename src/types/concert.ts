export type Venue = "KSPO Dome" | "Handball" | "Olympic Hall";

export type ConcertState = {
  goodsStatus: string;
  crowdLevel: string;
  note: string;
  updatedAt: string;
};

export type MiniGuide = {
  entryTip: string;
  lastTrainTip: string;
  transportTip: string;
  noticeTip: string;
};

export type Concert = {
  id: string;
  artist: string;
  venue: Venue;
  date: string;
  startTime: string;
  ticketUrl: string;
  lineOpenChatUrl: string;
  posterTone: "pink" | "violet" | "sky" | "amber" | "emerald" | "indigo";
  state: ConcertState;
  miniGuide: MiniGuide;
};
