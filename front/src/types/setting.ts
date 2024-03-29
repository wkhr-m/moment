export type Setting = {
  id: string;
  order: ViewerOrderType;
  secondLangIsHide: boolean;
  voice?: string;
  isAutoPlay: boolean;
  useSpeechSynthesis: boolean;
  speechRate?: number;
};

export type ViewerOrderType = typeof ViewerOrder[keyof typeof ViewerOrder];
export const ViewerOrder = {
  JAEN: 'JaEn',
  ENJA: 'Enja',
};
