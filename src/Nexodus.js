const {BrowserWindow} = require('electron');
const Battlerite = require('./games/Battlerite');
const EventEmitter = require('events');
const {ErrorUnknown} = require('./utils/Errors');
const Launcher = require('./Launcher');

const {ipcMain, protocol} = require('electron');
const path = require('path');

class Nexodus extends EventEmitter {
	constructor() {
		this.games = {};

		this.registerGame(Battlerite);
		this.launcher = new Launcher(this.games);
	}

	async init() {
		await this.launcher.init();
		this.registerProtocol();

		ipcMain.on('login', async ({sender}, {id, password}) => {
			const privacy = this.launcher.store.state.config.privacy;
			let username = '';

			try {
				username = await this.launcher.login(id, password, privacy.saveEmail, privacy.saveLogin);
			} catch(err) {
				err.isFatal = false;

				if(!err.isNexodusError) {
					this.logError(err);

					err = new ErrorUnknown();
					err.isFatal = true;
				}

				sender.send('login', {
					result: false,
					message: err.message,
					isFatal: err.isFatal
				});
				return;
			}

			sender.send('login', {
				result: true,
				username: this.launcher.username
			});
		});

		ipcMain.on('logout', () => {
			this.launcher.forget(false);
			this.launcher.store.requestSave();
		});

		ipcMain.on('config', async (event, {sectionKey, configKey, value}) => {
			this.launcher.store.state.config[sectionKey][configKey] = value;

			const configKey = `${sectionKey}.${configKey}`;
			this.emit(configKey, value);

			this.launcher.store.requestSave();
		});

		ipcMain.on('homepage', (event, game) => {
			if(!this.games[game]) return;

			opn(this.games[game].gameWeb);
		});

		ipcMain.on('launch', (event, {game, args}) => {
			if(!this.games[game]) return;

			try {
				this.launcher.launchGame(game, args);
			} catch(err) {
				if(err.nexodusName === 'LoginFailed') {
					//TODO send re-login form
				}
			}
			//TODO do afterlaunch
			//TODO track statistics
		});

		ipcMain.on('minimize', () => {

		});

		ipcMain.on('maximize', () => {

		});

		ipcMain.on('close', () => {

		});

		ipcMain.on('getInfo', () => {
			//TODO send config, statistics, username
		});

		this.on('privacy.saveEmail', value => {
			if(!value) this.launcher.forget();
		});

		this.on('privacy.saveLogin', value => {
			if(!value) this.launcher.forget(false);
		});
	}

	registerGame(game) {
		this.games[game.name] = game;
	}

	registerProtocol() {
		protocol.registerStandardSchemes(['nexodus']);
		protocol.registerFileProtocol('nexodus', (req, cb) => {
			const reqPath = req.url.replace(/^nexodus:\/\/caydesix\/?/, '').replace(/\?.*/, '').replace(/\#.*/, '');
			const pathSplit = reqPath.split('/');

			if(pathSplit[0] === 'dist') {
				pathSplit.shift();
				cb(path.resolve(__dirname, '..', 'dist', ...pathSplit));
				return;
			}

			cb(path.resolve(__dirname, '..', 'index.html'));
		});
	}

	showLogin() {
		return new Promise(resolve => {
			if(this.loginWindow) {
				this.loginWindow.focus();

				resolve();
				return;
			}

			this.loginWindow = new BrowserWindow({
				width: 400,
				height: 600,
				resizable: false,
				show: false,
				frame: false,
				title: 'Nexodus - Login'
			});

			this.loginWindow.setMenu(null);

			this.loginWindow.once('ready-to-show', () => {
				this.loginWindow.show();
				resolve();
			});

			this.loginWindow.on('closed', () => {
				this.loginWindow = null;
			});

			this.mainWindow.loadURL('nexodus://caydesix/login');
		});
	}

	showLauncher() {
		return new Promise(resolve => {
			if(this.mainWindow) {
				this.mainWindow.focus();

				resolve();
				return;
			}

			this.mainWindow = new BrowserWindow({
				width: 1280,
				height: 720,
				minWidth: 640,
				minHeight: 360,
				show: false,
				frame: false,
				title: "Nexodus"
			});

			this.mainWindow.setMenu(null);

			this.mainWindow.once('ready-to-show', () => {
				this.mainWindow.show();
				resolve();
			});

			this.mainWindow.on('closed', () => {
				this.mainWindow = null;
			});

			this.mainWindow.loadURL('nexodus://caydesix/');
		});
	}

	logError(err) {
		//TODO
	}
}

module.exports = Nexodus;
