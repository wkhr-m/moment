export type Book = {
  id: string;
  title: string;
  count: number;
  updatedAt: string;
  sheetName: string;
  sheetId: string;
  section: Section[];
};

export type Section = {
  id: string;
  count: number;
};

export type Sentense = {
  ja: string;
  en: string;
  section: string;
  number: number;
  note: string;
  pronunciation?: string;
  audioUrl?: string;
};
