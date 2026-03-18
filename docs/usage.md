---
layout: default
title: TextCure
---
# Usage

This plugin creates a button in the plugin tab in OnlyOffice. You will be able to use this plugin to either correct the whole document or just the selection.

## WebSocket Port

This plugin uses the WebSocket to communicate with Connectix to provide modifications to the text. However, Connectix does not use a fixed port number, and in OnlyOffice, the plugin has no access to external environments, so it is impossible to know the port number. Therefore, you should provide it manually with the plugin.

To do this, you should first find out where you installed your Connectix. Under the subfolder `Application\Bin64`, you will see there is an executable named `AgentConnectixConsole`. Open terminal and go to this directory, and run

```
./AgentConnectixConsole --api
```

You will see the output like this:

```
{"port":49152}
```

You should put this number in the settings dialog.

## Launch the Corrector

### Document

There are two ways of using the corrector:

* **When you don't have any selections, the correction will be on the whole document.** In this mode, the correction will only be applied in text paragraphs; tables and other types of elements are not included.
* **Or you can make a correction just on the selected text.** In this mode, you can select any text including those inside the table.

### Spreadsheet and Presentation

For these two, you should make some selections first and make the correction.

All the corrections in Antidote will be reflected lively in the original documents. A change of selection will also be synchronized to the Antidote, so you don't have to open and close the Antidote window frequently.
