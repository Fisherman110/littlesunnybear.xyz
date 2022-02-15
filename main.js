const { app, BrowserWindow, Menu } = require('electron');

require('@electron/remote/main').initialize();

Menu.setApplicationMenu(null)

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true, // 是否集成 Nodejs
            enableRemoteModule: true  // 这句必须要有,否则 require("electron").remote.BrowserWindow;是空
        }
    })

    
    require("@electron/remote/main").enable(win.webContents);
    win.loadFile('./App/start.html');

    
}


app.whenReady().then(() => {
    createWindow();
})
