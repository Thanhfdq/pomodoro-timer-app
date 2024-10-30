//modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const createWindow = () => {
  //create the browser window
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
  });

  //and load the index.html of the app.
  mainWindow.loadFile("index.html");
};

//this method will be called when Electron has finished
//initialization and is ready to create browser windows
//some APIs can only be used after this event occurs
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    //on MacOS it's common to re-create a window in the app when ...
    // the dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//quit when all windows are closed, except on MacOS.
//There, it's common for applications and their menu bar to stay active until ...
//the user quits explicitly with cmd+Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
