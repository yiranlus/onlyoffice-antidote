import { applyTranslation } from "./utils";

export function setupPlugin() {
  window.Asc.plugin.init = () => {
  }

  window.Asc.plugin.onTranslate = () => {
    applyTranslation("antidote-connction-error-heading", "Antidote Connection Error");
    applyTranslation("antidote-connection-error-message", "Please make sure that the port number is correct or that Antidote Connector is installed.");
  };
}
