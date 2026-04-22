export type ParamsAllowEdit = {
  zoneId: string;
  context: string;
  positionStart: number;
  positionEnd: number;
};

export type ParamsSelect = {
  zoneId: string;
  positionStart: number;
  positionEnd: number;
};

export type ParamsReplace = {
  zoneId: string;
  newString: string;
  positionStartReplace: number;
  positionReplaceEnd: number;
};

export type ParamsGetZonesToCorrect = {
  forActiveSelection?: boolean;
};

export type ParamsNewCorrectionMemory = {
  data: Uint8Array | string;
};

export declare enum AntiOopsDetectionType {
  errors = "errors",
  typography = "typography",
  attachments = "attachments",
  inactiveLanguage = "inactiveLanguage",
  abrasiveTone = "abrasiveTone",
}

export type ParamsResponseAntiOops = {
  id: string;
  errorCode?: number;
  detections?: AntiOopsDetectionType[];
};

export type WordProcessorConfiguration = {
  documentTitle?: string;
  carriageReturn?: string;
  cacheIdType?: string;
  allowCarriageReturn?: boolean;
  allowNBSpace?: boolean;
  allowThinSpace?: boolean;
  allowSending?: boolean;
  replaceWithoutSelection?: boolean;
  correctionMemory?: string;
  activeMarkup?: DocumentType;
  antidoteSettings?: object;
};

export enum DocumentType {
  text = "text",
  markdown = "markdown",
  latex = "latex",
  subrip = "subrip",
  html = "html",
}

export enum TextStyle {
  bold = "bold",
  italic = "italic",
  superscript = "superscript",
  subscript = "subscript",
  strike = "strike",
}

export type StyleInfo = {
  positionStart: number;
  positionEnd: number;
  style: TextStyle;
};

export type TextZoneConnectix = {
  text: string;
  zoneId: string;
  positionSelectionStart?: number;
  positionSelectionEnd?: number;
  zoneIsFocused: boolean;
  styleInfo?: StyleInfo[];
};
