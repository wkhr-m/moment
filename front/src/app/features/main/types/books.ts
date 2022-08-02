export type Book = {
  id: string;
  title: string;
  count: number;
};

export type DetailBook = {
  id: string;
  title: string;
  count: number;
  section: Section[];
  color?: string;
  bgColor?: string;
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
  pronanciation?: string;
};
