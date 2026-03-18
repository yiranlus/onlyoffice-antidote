---
layout: default
title: Build
---
# Build

If you are interested in building the plugin yourself, you can fork the project on GitHub and clone it to your PC. The project is written in Typescript to avoid some Javascript quirks.

First, you need to install the dependencies using:

```
npm install
```

in the project root folder.

Then, you can use the following command to build the plugin:

```
npm run build:plugin
```

After that, you will be able to find a folder named `textcure` that contains all the compiled Javascript files and another file name ending with `.plugin` at the project root.
