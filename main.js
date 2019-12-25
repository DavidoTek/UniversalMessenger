const { app, BrowserWindow, BrowserView, ipcMain, session } = require('electron')
const path = require('path')
const fs = require('fs')

let win
let view

let services = {};

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 320,
    icon: path.join(app.getAppPath(), 'umsg.ico'),
    frame: false,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  })

  win.loadFile('index.html')

  addServices()
  win.webContents.on('did-finish-load', () => {
    for (var name in services) {
      win.webContents.send('addservice', services[name])
    }
  })
  
  win.on('closed', () => {
    win = null
  })

  view = new BrowserView()
  win.setBrowserView(view)
  view.setBounds({x: 0, y: 32, width: 800, height: 568})
  view.setAutoResize({width: true, height: true})
  view.webContents.loadFile(path.join(app.getAppPath(), services['0home']))
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('selectservice', (event, arg) => {
  if (services[arg].localfile) {
    view.webContents.loadFile(path.join(app.getAppPath(), services[arg].localfile))
  } else {
    viewLoadURL(services[arg].weburl)
  }
})

function viewLoadURL(url) {
  view.webContents.loadURL(url, {
      userAgent: win.webContents.getUserAgent().replace(/(Electron|universalmessenger)\/([0-9\.]+)\ /gi, "")
  });
}

function addServices() {
  var servicespath = path.join(app.getAppPath(), 'services')
  
  var files = fs.readdirSync(servicespath)

  files.forEach((file) => {
    var jsonfile = path.join(servicespath, file, 'service.json')
    data = fs.readFileSync(jsonfile)
    var serviceinfo = JSON.parse(data)
    services[serviceinfo.name] = serviceinfo
  })
}