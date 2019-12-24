const { remote, ipcRenderer } = require('electron')

window.closeCurrentWindow = function () {
    remote.BrowserWindow.getFocusedWindow().close()
}

window.minimizeCurrentWindow = function () {
    remote.BrowserWindow.getFocusedWindow().minimize()
}

window.isMaximized = remote.BrowserWindow.getFocusedWindow().isMaximized()

window.maximizeCurrentWindow = function () {
    if (remote.BrowserWindow.getFocusedWindow().isMaximized()) {
        remote.BrowserWindow.getFocusedWindow().unmaximize()
    } else {
        remote.BrowserWindow.getFocusedWindow().maximize()
    }
    window.isMaximized = remote.BrowserWindow.getFocusedWindow().isMaximized()
}

window.selectService = function(service) {
    ipcRenderer.send('selectservice', service)
}

ipcRenderer.on('addservice', (event, arg) => {
    window.postMessage({type: 'ADDSERVICE', text: arg})
})