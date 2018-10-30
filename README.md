# electron-deeplink
This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start) within the Electron documentation.

It handles deeplinks on Windows and macOS for cold and warm start scenarios and was strongly influenced by [https://github.com/oikonomopo/electron-deep-linking-mac-win](https://github.com/oikonomopo/electron-deep-linking-mac-win)

# Usage
You need to install the Electron app to test all scenarios:
* Cold start on Windows/macOS
* Warm start on Windows/macOS

Run:
```
npm run dist
```
and then install the application.

## Windows
From a command line prompt run
```
start myapp://?key=abc
```
## macOS
From a terminal run
```
open myapp://?key=abc
```

In both cases you should see similar log statements in the console of main.js:
```
open-url: myapp://?key=abc
handleOpenUrl: source: open-url url: myapp://?key=abc
```
In both cases you should see similar log statements in the console of renderer.js (Chrome Developer tools):
```
abc
```

# Workflow
![Workflow](workflow.png)

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
