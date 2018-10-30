const { app } = require('electron');

// ProtocolHandler keeps track of openUrl when launched from other apps which is
// necessary to correctly handle cold start and warm start scenarios on Windows.
// Contrary to macOS, app.on('open-url', ...) handler does not work on Windows.
class ProtocolHandler {
    constructor(scheme, onOpenUrl) {
        this._scheme = scheme;
        app.setAsDefaultProtocolClient(this._scheme);
        this._onOpenUrl = onOpenUrl;
        const self = this;

        // Protocol handler for macOS on cold or warm start
        app.on('open-url', function (event, url) {
            console.log(`open-url: ${url}`);
            self._openUrl = url;
            self._handleOpenUrl('open-url');
        });

        // Protocol handler for Windows on cold start
        app.on('ready', () => {
            if (process.platform === 'win32') {
                console.log(`ready: argv: ${process.argv.toLocaleString()}`);
                self._openUrl = self._extractUrlWindows(process.argv);
                self._handleOpenUrl('ready');
            }
        });

        // Protocol handler for Windows on warm start
        app.on('second-instance', (event, argv, wd) => {
            if (process.platform === 'win32') {
                console.log(`second-instance: argv: ${argv.toLocaleString()}`);
                self._openUrl = self._extractUrlWindows(argv);
                self._handleOpenUrl('second-instance');
            }
        });
    }

    // Manually notify ProtocolHandler that the app is ready
    onAppReady() {
        this._handleOpenUrl('onAppReady');
    }

    // Try to handle openUrl requests
    _handleOpenUrl(source) {
        const url = this._openUrl != null ? new URL(this._openUrl) : null;
        if (url != null) {
            console.log(`handleOpenUrl: source: ${source} url: ${url.toString()}`);
            // Reset _openUrl in case it was handled
            if (this._onOpenUrl(url)) {
                this._openUrl = null;
            }
        }
    }

    // Extract protocol handler url for win32, e.g. key=abc of {_scheme}://?key=abc
    _extractUrlWindows(argv) {
        let url = null;
        if (process.platform === 'win32' && argv !== null) {
            console.log(`extractUrlWindows: ${argv.toLocaleString()}`);
            argv.forEach(arg => {
                if (arg.startsWith(this._scheme + '://')) {
                    url = arg;
                }
            });
        }
        return url;
    }
}

module.exports = ProtocolHandler;
