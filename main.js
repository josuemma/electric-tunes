var Path = require('path'),
    ElectronApp = require('app'),
    BrowserWindow = require('browser-window'),
    Menu = require('menu'),
    Tray = require('tray'),
    GlobalShortcut = require('global-shortcut'),
    Ipc = require('ipc')









//
// APP WINDOW
//

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null
var buildWindow = function(bounds) {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    center: true,
    resizable: false,
    'skip-taskbar': true,
    frame: false,
    show: false
  })

  // Load the index.html of the app.
  mainWindow.loadUrl(Path.join('file:/', __dirname, 'index.html'))

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object
    mainWindow = null
  })
}










//
// TRAY ICON
//

var iconPath = Path.join(__dirname, 'icon.png'),
    appIcon = null
var buildTray = function() {
  appIcon = new Tray(iconPath)
  appIcon.setTitle('Tunes')

  GlobalShortcut.register('MediaNextTrack', function() {
    mainWindow.webContents.send('player.next')
  })

  GlobalShortcut.register('MediaPreviousTrack', function() {
    mainWindow.webContents.send('player.previous')
  })

  GlobalShortcut.register('MediaPlayPause', function() {
    mainWindow.webContents.send('player.playpause')
  })

  appIcon.on('clicked', function(e, bounds) {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.setPosition(parseInt(bounds.x + (bounds.width / 2) - 200), bounds.y + bounds.height)
      mainWindow.show()
    }
  })
}









//
// WINDOW EVENTS
//

Ipc.on('track.changed', function(event, trackName) {
  if (appIcon) {
    appIcon.setTitle(trackName)
  }
})










//
// APP LIFECYCLE
//

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
ElectronApp.on('ready', function() {
  buildWindow()
  buildTray()
})

ElectronApp.on('will-quit', function() {
  GlobalShortcut.unregisterAll()
})
