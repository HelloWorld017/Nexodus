const {app, protocol} = require('electron');
const {autoUpdater} = require('electron-updater');

const Nexodus = require('./Nexodus');

autoUpdater.checkForUpdatesAndNotify();
protocol.registerStandardSchemes(['nexodus']);

const nexodus = new Nexodus();

app.on('ready', async () => {
	await nexodus.startLauncher();
});
