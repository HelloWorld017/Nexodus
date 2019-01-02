const {app} = require('electron');
const Nexodus = require('./Nexodus');

const nexodus = new Nexodus();

app.on('ready', async () => {
	await nexodus.init();
	await nexodus.showLogin();
});
