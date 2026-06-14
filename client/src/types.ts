export type Rate = "点3" | "点5" | "点10" | "カスタム";

export type Hanchan = {
  id: number;
  session_id: number;
  position: 1 | 2 | 3 | 4;
  score: number;
  chip_delta: number;
  table_fee: number;
  created_at: string;
};

export type Session = {
  id: number;
  store_name: string;
  played_at: string;
  rate: Rate;
  chip_price: number;
  created_at: string;
};

export type SessionWithSummary = Session & {
  hanchan_count: number;
  total_score: number;
  total_chip: number;
  total_income: number;
};

export type SessionDetail = Session & {
  hanchan: Hanchan[];
};
