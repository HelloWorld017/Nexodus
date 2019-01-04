const {app, protocol} = require('electron');
const Nexodus = require('./Nexodus');

protocol.registerStandardSchemes(['nexodus']);

const nexodus = new Nexodus();

app.on('ready', async () => {
	await nexodus.startLauncher();
});
