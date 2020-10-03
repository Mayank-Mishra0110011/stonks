/*
Design first
Integrate canvas with design later
Make api to query yfinance stonks
params:
  stonks name {list},
  intervalStart {date},
  intervalEnd {date}
*/

const { app, BrowserWindow, screen, globalShortcut } = require("electron");

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: "./static/images/48.png",
    title: "Stonks",
  });

  /*
  Build stonk specific menu items later
  +import Menu
  const menu = Menu.buildFromTemplate([
		{
			label: 'File',
			submenu: [
				{ label: 'New' },
				{ label: 'Create' },
				{ label: 'Open' },
				{ label: 'Save' },
				{ label: 'Save As' },
				{ label: 'Export' },
				{ label: 'Export As' },
				{ label: 'Print' },
				{ label: 'Properties' },
				{
					label: 'Exit',
					click() {
						app.quit();
					}
				}
			]
		}
	]);
  Menu.setApplicationMenu(menu);
  */

  globalShortcut.register("CommandOrControl+Q", () => {
    app.quit();
  });

  win.loadFile("./static/index.html");
  // not yet; win.webContents.openDevTools();
  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
