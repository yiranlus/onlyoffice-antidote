import {
  AntidoteConnector,
  ConnectixAgent,
} from "@druide-informatique/antidote-api-js";

import * as utils from "./utils";
import Settings from "./settings";
import { WordProcessorAgentOnlyOffice } from "./processor-agent/base";
import { WordProcessorAgentOnlyOfficeDocument } from "./processor-agent/document";
import { WordProcessorAgentOnlyOfficeDocumentSelection } from "./processor-agent/document-selection";
import { WordProcessorAgentOnlyOfficeUniversalSelection } from "./processor-agent/universal-selection";

export function setupPlugin() {
  let isInitialized = false;
  let wordProcessorAgent: WordProcessorAgentOnlyOffice | null;

  const connectionErrorModal = {
    url: utils.getFullUrl("connection-error.html"),  // Same HTML as config variationnt
    description: window.Asc.plugin.tr("Error"),
    isVisual: true,
    EditorsSupport: ["word"],
    isModal : true,
    isInsideMode : false,
    initDataType : "none",
    initData : "",
    size: [350, 150],
    buttons: [
      {
        text: window.Asc.plugin.tr("Close"),
        primary: true
      }
    ]
  };
  let connectionErrorModalId: string | null;

  const launchCorrector = () => {
    AntidoteConnector.announcePresence();

    if (AntidoteConnector.isDetected()) {
      console.log("Antidote Connector is detected")
    }

    const agent = new ConnectixAgent(
      wordProcessorAgent!,
      (AntidoteConnector.isDetected() && !Settings.getForceSetPort())?
      AntidoteConnector.getWebSocketPort :
      async () => Settings.getAntidotePort()
    );

    agent.connectWithAntidote()
      .then(() => agent.launchCorrector())
      .catch(error => {
        const errorDialog = new window.Asc.PluginWindow();
        errorDialog.show(connectionErrorModal);
        connectionErrorModalId = errorDialog.id;

        console.log(error);
      })
  }

  window.Asc.plugin.init = (text: string) => {
    const alternativeText = (text.length === 0) ? null : text;

    if (wordProcessorAgent && wordProcessorAgent.isAvailable) {
      // On every selection change

      if (!wordProcessorAgent.updatingByAntidote) {
        if (wordProcessorAgent instanceof WordProcessorAgentOnlyOfficeDocumentSelection) {
          setTimeout(() => {
            if (wordProcessorAgent && !wordProcessorAgent.updatingByAntidote) {
              wordProcessorAgent.updateText();
            }
          }, Settings.getUpdateDelayMS());
        } else if (wordProcessorAgent instanceof WordProcessorAgentOnlyOfficeUniversalSelection) {
          setTimeout(() => {
            (wordProcessorAgent as WordProcessorAgentOnlyOfficeUniversalSelection).setAlternativeText(alternativeText);
            if (wordProcessorAgent && !wordProcessorAgent.updatingByAntidote) {
              wordProcessorAgent.updateText();
            }
          }, Settings.getUpdateDelayMS());
        }
      }
    } else {
      // Otherwise, create an WordProcessorAgent instance
      let promise: Promise<void> | null = null;
      switch (window.Asc.plugin.info.editorType) {
        case "word":
          promise = utils.callCommand(
            () => {
              const oDocument = Api.GetDocument();
              const oDocumentInfo = oDocument.GetDocumentInfo();
              const title = oDocumentInfo.Title;

              const oRange = oDocument.GetRangeBySelect();
              const start = oRange ? oRange.GetStartPos() : null;
              const end = oRange ? oRange.GetEndPos() : null;

              const hasSelection = (start !== end);

              return { title, hasSelection };
            },
            false,
            false,
          )
            .then(async ({ title, hasSelection }) => {
              if (hasSelection) {
                wordProcessorAgent = new WordProcessorAgentOnlyOfficeDocumentSelection(title);
              } else {
                wordProcessorAgent = new WordProcessorAgentOnlyOfficeDocument(title);
              }
            });
          break;
        case "slide":
          promise = utils.callCommand(
            () => {
              const oPresentation = Api.GetPresentation();
              const oDocumentInfo = oPresentation.GetDocumentInfo();
              const title = oDocumentInfo.Title;

              return title;
            },
            false,
            false
          )
            .then(title => {
              wordProcessorAgent = new WordProcessorAgentOnlyOfficeUniversalSelection(title);
              (wordProcessorAgent as WordProcessorAgentOnlyOfficeUniversalSelection)
                .setAlternativeText(alternativeText);
            });
          break;
        case "cell":
          promise = utils.callCommand(
            () => {
              const oDocumentInfo = Api.GetDocumentInfo();
              const title = oDocumentInfo.Title;

              return title;
            },
            false,
            false
          )
            .then(title => {
              wordProcessorAgent = new WordProcessorAgentOnlyOfficeUniversalSelection(title);
              (wordProcessorAgent as WordProcessorAgentOnlyOfficeUniversalSelection)
                .setAlternativeText(alternativeText);
            });
          break;
      }

      if (promise) {
        promise.then(() => wordProcessorAgent!.updateText()).then(launchCorrector);
      }
    }

    isInitialized = true;
  };

  window.Asc.plugin.button = (id: string, windowId: string) => {
    if (connectionErrorModalId && windowId === connectionErrorModalId) {
      window.Asc.plugin.executeCommand("close", "");
    }
  };
}
