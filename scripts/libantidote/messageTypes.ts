import {
  TextZoneConnectix,
  ParamsAllowEdit,
  ParamsReplace,
  ParamsSelect,
  ParamsGetZonesToCorrect,
  ParamsResponseAntiOops,
  WordProcessorConfiguration,
} from "./common";

// Types of messages received from Antidote
type UserRequestType = {
  // Oh my god, this must be a mistake
  api_version: 2;
} & (
  | {
      message: "LaunchTool";
      toolApi: "Corrector" | "Dictionaries" | "Guides";
    }
  | {
      message: "AntiOops";
      subject: string;
      body: string;
      recipients?: string[];
      id: string;
    }
);

type AntidoteMessageTypeCommon = {
  idMessage: string;
  message: string;
  data?: boolean | string | object;
};

type ResponseTypeCommon = {
  idMessage: string;
};

type InitMessageType = AntidoteMessageTypeCommon & {
  message: "init";
};

type InitResponseType = ResponseTypeCommon & WordProcessorConfiguration;

type DocumentPathMessageType = AntidoteMessageTypeCommon & {
  message: "documentPath";
};

type DocumentPathResponseType = ResponseTypeCommon & {
  data: string;
};

type DocIsAvailableMessageType = AntidoteMessageTypeCommon & {
  message: "docIsAvailable";
};

type DocIsAvailableResponseType = ResponseTypeCommon & {
  data: boolean;
};

type GetTextZonesMessageType = AntidoteMessageTypeCommon & {
  message: "getTextZones";
  data: ParamsGetZonesToCorrect;
};

type GetTextZonesResponseType = ResponseTypeCommon & {
  data: TextZoneConnectix[];
};

type AllowEditMessageType = AntidoteMessageTypeCommon & {
  message: "allowEdit";
  data: ParamsAllowEdit;
};

type AllowEditResponseType = ResponseTypeCommon & {
  data: boolean;
};

type ReplaceMessageType = AntidoteMessageTypeCommon & {
  message: "replace";
  data: ParamsReplace;
};

type ReplaceResponseType = ResponseTypeCommon & {
  data: boolean;
};

type SelectMessageType = AntidoteMessageTypeCommon & {
  message: "select";
  data: ParamsSelect;
};

type ReturnToDocumentMessageType = AntidoteMessageTypeCommon & {
  message: "returnToDocument";
};

type NewCorrectionMemoryMessageType = AntidoteMessageTypeCommon & {
  message: "newCorrectionMemory";
  data: string;
};

type AntiOopsResponseMessageType = AntidoteMessageTypeCommon & {
  message: "antiOopsResponse";
  data: ParamsResponseAntiOops;
};

type SendMessageType = {
  message: "send";
};

type ErrorMessageType = AntidoteMessageTypeCommon & {
  message: "error";
  code: "string";
  data: string;
};

export type {
  UserRequestType,
  AntidoteMessageTypeCommon,
  InitMessageType,
  InitResponseType,
  DocumentPathMessageType,
  DocumentPathResponseType,
  DocIsAvailableMessageType,
  DocIsAvailableResponseType,
  GetTextZonesMessageType,
  GetTextZonesResponseType,
  AllowEditMessageType,
  AllowEditResponseType,
  ReplaceMessageType,
  ReplaceResponseType,
  SelectMessageType,
  ReturnToDocumentMessageType,
  NewCorrectionMemoryMessageType,
  AntiOopsResponseMessageType,
  SendMessageType,
  ErrorMessageType,
};

export type AntidoteMessageType =
  | InitMessageType
  | DocumentPathMessageType
  | DocIsAvailableMessageType
  | GetTextZonesMessageType
  | AllowEditMessageType
  | ReplaceMessageType
  | SelectMessageType
  | ReturnToDocumentMessageType
  | NewCorrectionMemoryMessageType
  | AntiOopsResponseMessageType
  | SendMessageType
  | ErrorMessageType;

export type UserMessageType =
  | InitResponseType
  | DocumentPathResponseType
  | DocIsAvailableResponseType
  | GetTextZonesResponseType
  | AllowEditResponseType
  | ReplaceResponseType;
