import { WordProcessorAgent } from "./WordProcessorAgent";
import {
  ParamsNewCorrectionMemory,
  ParamsReplace,
  ParamsResponseAntiOops,
  ParamsSelect,
} from "./common";
import {
  AntidoteMessageType,
  UserMessageType,
  UserRequestType,
} from "./messageTypes";
import * as message from "./messageTypes";

type GetWebsocketPortFunc = () => number | Promise<number>;

type MessageFrame = {
  idFrame: number;
  totalFrame: number;
  data: string;
};

export class ConnectixAgent {
  wordProcessorAgent: WordProcessorAgent;
  getWebsocketPort: GetWebsocketPortFunc;
  ws?: WebSocket;

  private chunkSize: number = 256;

  private messageFrames: MessageFrame[] = [];

  constructor(
    wordProcessorAgent: WordProcessorAgent,
    getWebsocketPort: GetWebsocketPortFunc,
  ) {
    this.wordProcessorAgent = wordProcessorAgent;
    this.getWebsocketPort = getWebsocketPort;
  }

  async connectWithAntidote(): Promise<void> {
    const port = await this.getWebsocketPort();

    this.ws = new WebSocket(`ws://localhost:${port}`);
    this.setupEventListeners();

    // Wait for the connection to be established
    await new Promise<void>((resolve) => {
      if (this.ws!.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        this.ws!.addEventListener("open", () => resolve());
      }
    });
  }

  launchCorrector() {
    const message: UserRequestType = {
      api_version: 2,
      message: "LaunchTool",
      toolApi: "Corrector",
    };

    this.sendMessage(message);
  }

  launchDictionaries() {
    const message: UserRequestType = {
      api_version: 2,
      message: "LaunchTool",
      toolApi: "Dictionaries",
    };

    this.sendMessage(message);
  }


  // --- Low level functions ---
  setChunkSize(chunkSize: number) {
    this.chunkSize = chunkSize;
  }

  private sendMessage(message: UserMessageType | UserRequestType) {
    const messageString = JSON.stringify(message);

    const totalFrame = Math.ceil(messageString.length / this.chunkSize);

    let i = 0;
    for (let idFrame = 0; idFrame < totalFrame; idFrame++) {
      const chunk = messageString.slice(i, i + this.chunkSize);
      const messageFrame: MessageFrame = {
        idFrame,
        totalFrame,
        data: chunk,
      };

      this.ws!.send(JSON.stringify(messageFrame));

      i += this.chunkSize;
    }
  }

  private setupEventListeners() {
    this.ws!.addEventListener("message", (event) => {
      const messageFrame = JSON.parse(event.data) as MessageFrame;
      this.messageFrames.push(messageFrame);

      if (messageFrame.idFrame !== messageFrame.totalFrame) return;

      // the response is complete, we can process it
      this.messageFrames.sort((a, b) => a.idFrame - b.idFrame);
      const currentMessage = JSON.parse(
        this.messageFrames.map((frame) => frame.data).join(""),
      );

      this.messageFrames = [];

      this.processMessage(currentMessage);
    });

    this.ws!.addEventListener("error", (error: any) => {
      throw error;
    });

    this.ws!.addEventListener("close", (_event) => {
      this.wordProcessorAgent.sessionEnded();
    });
  }

  private processMessage(message: AntidoteMessageType) {
    switch (message.message) {
      case "init":
        this.wordProcessorAgent.sessionStarted();
        this.sendMessage({
          idMessage: message.idMessage,
          ...this.wordProcessorAgent.configuration(),
        } as message.InitResponseType);
        break;
      case "documentPath":
        this.sendMessage({
          idMessage: message.idMessage,
          data: this.wordProcessorAgent.documentPath(),
        } as message.DocumentPathResponseType);
        break;
      case "docIsAvailable":
        this.sendMessage({
          idMessage: message.idMessage,
          data: !this.wordProcessorAgent.textZonesAvailable(),
        } as message.DocIsAvailableResponseType);
        break;
      case "getTextZones":
        this.sendMessage({
          idMessage: message.idMessage,
          data: this.wordProcessorAgent.zonesToCorrect(message.data),
        } as message.GetTextZonesResponseType);
        break;
      case "allowEdit":
        this.sendMessage({
          idMessage: message.idMessage,
          data: this.wordProcessorAgent.allowEdit(message.data),
        } as message.AllowEditResponseType);
        break;
      case "replace":
        this.sendMessage({
          idMessage: message.idMessage,
          data: this.wordProcessorAgent.correctIntoWordProcessor(
            message.data as ParamsReplace,
          ),
        } as message.ReplaceResponseType);
        break;
      case "select":
        this.wordProcessorAgent.selectInterval(message.data as ParamsSelect);
        break;
      case "returnToDocument":
        this.wordProcessorAgent.returnToWordProcessor();
        break;
      case "newCorrectionMemory":
        this.wordProcessorAgent.newCorrectionMemory({
          data: message.data,
        } as ParamsNewCorrectionMemory);
        break;
      case "antiOopsResponse":
        this.wordProcessorAgent.responseAntiOops(
          message.data as ParamsResponseAntiOops,
        );
        break;
      case "send":
        this.wordProcessorAgent.send();
        break;
      case "error":
      default:
        throw new Error(message.data);
    }
  }
}
