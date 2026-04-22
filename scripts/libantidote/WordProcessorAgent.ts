import {
  ParamsAllowEdit,
  ParamsNewCorrectionMemory,
  ParamsReplace,
  ParamsResponseAntiOops,
  ParamsSelect,
  WordProcessorConfiguration,
  ParamsGetZonesToCorrect,
  TextZoneConnectix,
} from "./common";

export abstract class WordProcessorAgent {
  sessionStarted(): void {}

  sessionEnded(): void {}

  abstract correctIntoWordProcessor(params: ParamsReplace): boolean;

  textZonesAvailable(): boolean {
    return true;
  }

  abstract configuration(): WordProcessorConfiguration;

  documentPath(): string {
    return "";
  }

  abstract allowEdit(params: ParamsAllowEdit): boolean;

  selectInterval(_params: ParamsSelect): void {}

  newCorrectionMemory(_params: ParamsNewCorrectionMemory): void {}

  putFocusOnDocument(): void {}

  returnToWordProcessor(): void {}

  responseAntiOops(_params: ParamsResponseAntiOops): void {}

  send(): void {}

  abstract zonesToCorrect(params: ParamsGetZonesToCorrect): TextZoneConnectix[];
}
