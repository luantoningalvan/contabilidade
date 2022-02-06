const { app, BrowserWindow } = require("electron");
require("./src/server");

function createWindow() {
  let win = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: { nodeIntegration: true },
  });
  // win.webContents.openDevTools()
  win.loadURL("http://localhost:3333/");

  win.focus();
}

app.whenReady().then(createWindow);
