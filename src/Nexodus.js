const {BrowserWindow} = require('electron');
const Battlerite = require('./games/Battlerite');
const EventEmitter = require('events');
const {ErrorUnknown} = require('./utils/Errors');
const Launcher = require('./Launcher');

const {app, ipcMain, protocol} = require('electron');
const { exec } = require('child_process');
const opn = require('opn');
const path = require('path');

class Nexodus extends EventEmitter {
	constructor() {
		super();

		this.games = {};

		this.registerGames();
		this.launcher = new Launcher(this);
	}

	async startLauncher() {
		await this.init();

		if(!this.launcher.loggedIn) {
			this.showLogin();
		} else {
			this.showLauncher();
		}
	}

	async init() {
		await this.launcher.init();

		this.registerProtocol();

		app.on('window-all-closed', () => {
			//TODO
		});

		ipcMain.on('login', async ({sender}, {id, password}) => {
			const security = this.launcher.store.state.config.security;

			try {
				await this.launcher.login(id, password, security.saveEmail, security.saveLogin);
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

		ipcMain.on('logout', ({sender}) => {
			const win = BrowserWindow.fromWebContents(sender);
			win.close();

			this.launcher.logout();
			this.showLogin();
		});

		ipcMain.on('openLauncher', ({sender}) => {
			const win = BrowserWindow.fromWebContents(sender);
			win.close();

			this.showLauncher();
		});

		ipcMain.on('config', async (event, {section, config, value}) => {
			let configKey;

			if(config) {
				this.launcher.store.state.config[section][config] = value;
				configKey = `${section}.${config}`;
			} else {
				this.launcher.store.state.config[section] = value;
				configKey = `${section}`;
			}

			this.emit(configKey, value);

			this.launcher.store.requestSave();
		});

		ipcMain.on('homepage', (event, game) => {
			if(!this.games[game]) return;
			opn(this.games[game].gameWeb);
		});

		ipcMain.on('launch', async (event, {game, args}) => {
			if(!this.games[game]) return;
			if(this.runningStats[game].running) return;

			try {
				await this.launcher.launchGame(game, args);
			} catch(err) {
				if(err.nexodusName === 'LoginFailed') {
					//TODO send re-login form
				}
			}
			//TODO do afterlaunch
			//TODO track statistics
		});

		ipcMain.on('getInfo', ({sender}) => {
			const info = {
				config: this.launcher.store.state.config,
				username: this.launcher.username
			};

			sender.send('getInfo', info);
		});

		this.on('security.saveEmail', value => {
			if(!value) this.launcher.forget();
		});

		this.on('security.saveLogin', value => {
			if(!value) this.launcher.forget(false);
		});
	}

	registerGame(game) {
		this.games[game.id] = game;
	}

	registerGames() {
		this.registerGame(Battlerite);
	}

	registerProtocol() {
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
				title: 'Nexodus - Login',
				webPreferences: {
					nodeIntegration: true
				}
			});

			this.loginWindow.setMenu(null);

			this.loginWindow.once('ready-to-show', () => {
				this.loginWindow.show();
				resolve();
			});

			this.loginWindow.on('closed', () => {
				this.loginWindow = null;
			});

			this.loginWindow.loadURL('nexodus://caydesix/login');
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
		console.error(err);
		//TODO
	}

	beforeExit() {
		this.launcher.store.save();
		//TODO call this function before exit
	}
}

module.exports = Nexodus;
