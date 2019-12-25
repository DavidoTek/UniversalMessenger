const config = require('electron-json-config')
const { ipcRenderer } = require('electron')

window.enableservice = function (name, enable) {
    config.set(name + '.enabled', enable)
}

window.getenabled = function(name) {
    return config.get(name + '.enabled', true)
}

window.getservices = function () {
    return config.keys()
}

window.deleteCookies = function () {
    ipcRenderer.send('deletecookies')
    ipcRenderer.send('restartapp')
}

window.restartapp = function () {
    ipcRenderer.send('restartapp')
}

window.addservicefile = function (file) {
    ipcRenderer.send('addservicefile', file)
}