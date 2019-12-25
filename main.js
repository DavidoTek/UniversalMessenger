const { app, BrowserWindow, BrowserView, ipcMain, session, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const config = require('electron-json-config')

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
      if(config.get(name + '.enabled', true)) {
        win.webContents.send('addservice', services[name])
      }
    }
  })
  
  win.on('closed', () => {
    win = null
    app.quit()
  })

  view = new BrowserView()
  win.setBrowserView(view)
  view.setBounds({x: 0, y: 32, width: 800, height: 568})
  view.setAutoResize({width: true, height: true})
  view.webContents.loadFile(path.join(app.getAppPath(), services['0home'].localfile))
  view.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })
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
  } else if (services[arg].settingsfile) {
    showSettings()
  } else {
    viewLoadURL(services[arg].weburl)
  }
})

ipcMain.on('deletecookies', (event, arg) => {
  session.defaultSession.clearStorageData([], (data) => {})
})

ipcMain.on('restartapp', (event, arg) => {
  app.relaunch()
  app.quit()
})

ipcMain.on('addservicefile', (event, arg) => {
  var data = fs.readFileSync(arg)
  var serviceinfofile = JSON.parse(data)
  addUserService(serviceinfofile)
})

function viewLoadURL(url) {
  view.webContents.loadURL(url, {
      userAgent: win.webContents.getUserAgent().replace(/(Electron|universalmessenger)\/([0-9\.]+)\ /gi, "")
  });
}

// reads all services and adds them to 'services'
function addServices() {
  // Read preinstalled services
  var servicespath = path.join(app.getAppPath(), 'services')
  
  var files = fs.readdirSync(servicespath)

  files.forEach((file) => {
    var jsonfile = path.join(servicespath, file, 'service.json')
    data = fs.readFileSync(jsonfile)
    var serviceinfo = JSON.parse(data)
    services[serviceinfo.name] = serviceinfo
    services[serviceinfo.name].iconpath = path.join(app.getAppPath(), 'services', serviceinfo.name, 'icon.png').replace(/\\/g, "/")
    if (!serviceinfo.appservice) {
      config.set(serviceinfo.name + '.name', serviceinfo.name)
    }
  })

  // Read user-added services
  servicespath = path.join(app.getPath('userData'), 'services')
  
  files = fs.readdirSync(servicespath)
  console.log(servicespath + ' files: ' + files)

  files.forEach((file) => {
    var jsonfile = path.join(servicespath, file, 'service.json')
    data = fs.readFileSync(jsonfile)
    var serviceinfo = JSON.parse(data)
    services[serviceinfo.name] = serviceinfo
    services[serviceinfo.name].iconpath = path.join(app.getPath('userData'), 'services', serviceinfo.name, 'icon.png').replace(/\\/g, "/")
    
    if (!serviceinfo.appservice) {
      config.set(serviceinfo.name + '.name', serviceinfo.name)
    }
  })
}

function addUserService(serviceinfo) {
  var servicepath = path.join(app.getPath('userData'), 'services', serviceinfo.name)
  fs.mkdirSync(servicepath)
  var data = JSON.stringify(serviceinfo)
  fs.writeFileSync(path.join(servicepath, 'service.json'), data)
}

// Shows the settings window
function showSettings() {
  settingswin = new BrowserWindow({
    parent: win,
    width: 400,
    height: 600,
    resizable: false,
    icon: path.join(app.getAppPath(), 'umsg.ico'),
    title: 'UniversalMessenger ' + app.getVersion() + ' Settings',
    webPreferences: {
      preload: path.join(app.getAppPath(), 'settingspage/preload.js')
    }
  })
  settingswin.setMenu(null)

  settingswin.loadFile('settingspage/settings.html')
  
  settingswin.on('closed', () => {
    settingswin = null
  })
}