const {BrowserWindow, Menu, Tray} = require('electron');
const EventEmitter = require('events');
const {ErrorUnknown} = require('./utils/Errors');
const Launcher = require('./Launcher');
const ProcessMonitor = require('./utils/ProcessMonitor');
const Statistics = require('./utils/Statistics');

const {app, dialog, ipcMain, nativeImage, protocol} = require('electron');
const {exists} = require('./utils/utils');
const games = require('./games');
const isDev = require('electron-is-dev');
const opn = require('opn');
const path = require('path');

class Nexodus extends EventEmitter {
	constructor() {
		super();

		this.games = {};

		this.registerGames();
		this.launcher = new Launcher(this);

		this.monitor = new ProcessMonitor(this);
		this.stats = {};
	}

	async startLauncher() {
		await this.init();

		const args = process.argv.slice(isDev ? 2 : 1);
		const general = this.launcher.store.state.config.general;

		if(general.enableTray) {
			const trayIcon = nativeImage.createFromPath(path.resolve(__dirname, '..', 'app', 'images', 'Nexodus.png'));

			this.tray = new Tray(trayIcon);
			this.tray.setToolTip('Nexodus');
			this.tray.setContextMenu(this.getMenu());
			this.tray.on('click', () => {
				this.show();
			});

			if(general.runAsMinimized && args.includes('--auto-start')) return;
		}

		await this.show();
	}

	async show() {
		if(!this.launcher.loggedIn) {
			await this.showLogin();

			this.removeAllListeners('login.ui');
			this.on('login.ui', () => {
				this.showLauncher();
			});
		} else {
			await this.showLauncher();
		}
	}

	async init() {
		await this.launcher.init();
		if(!this.launcher.store.state.stats) this.launcher.store.state.stats = {};

		this.monitor.on('start', ({gameName}) => {
			this.log(`Started ${gameName}`);
			this.stats[gameName].startedGame();
		});

		this.monitor.on('end', ({gameName, runningTime}) => {
			this.log(`Played ${gameName} for ${runningTime}`);
			this.stats[gameName].playedTime(Math.floor(runningTime / (60 * 1000)));
		});

		setInterval(() => {
			Object.keys(this.stats).forEach(gameName => {
				this.stats[gameName].updateStatistics();
			});

			this.monitor.checkUpdate();
		}, 5000);

		this.registerProtocol();

		app.on('window-all-closed', () => {
			if(!this.launcher.store.state.config.general.closeMeansMinimize) {
				this.beforeExit();
			}
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

			this.emit('login.ui');
			BrowserWindow.fromWebContents(sender).close();
		});

		ipcMain.on('logout', async ({sender}) => {
			this.launcher.logout();
			await this.show();

			const win = BrowserWindow.fromWebContents(sender);
			win.close();
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

		ipcMain.on('launch', (event, launchObj) => {
			this.launch(launchObj);
		});

		ipcMain.on('getInfo', ({sender}) => {
			sender.send('getInfo', {
				config: this.launcher.store.state.config,
				statistics: Object.keys(this.stats).reduce((prev, k) => {
					prev[k] = this.stats[k].exportData();
					return prev;
				}, {}),
				id: this.launcher.id,
				username: this.launcher.username
			});
		});

		this.on('exitPrompt', resp => {
			if(resp) {
				this.beforeExit(true);
				return;
			}

			if(!this.launcher.store.state.config.general.closeMeansMinimize && !this.mainWindow) {
				this.showLauncher();
			}
		});

		this.on('security.saveEmail', value => {
			if(!value) this.launcher.forget();
		});

		this.on('security.saveLogin', value => {
			if(!value) this.launcher.forget(false);
		});

		this.on('general.runOnStartup', async value => {
			try {
				app.setLoginItemSettings({
					openAtLogin: value,
					args: ['--auto-start']
				});
			} catch(e) {}
		});

		this.on('login', () => {
			if(!this.launcher.store.state.stats[this.launcher.id])
				this.launcher.store.state.stats[this.launcher.id] = {};

			this.stats = Object.keys(this.games).reduce((prev, curr) => {
				const data = this.launcher.store.state.stats[this.launcher.id][curr];
				let stat;

				if(data) {
					stat = Statistics.importData(curr, data);
				} else {
					stat = new Statistics(curr);
				}

				stat.on('updateStatistics', () => {
					const exportData = stat.exportData();
					this.log(`Status updated for ${curr}`);

					this.launcher.store.state.stats[this.launcher.id][curr] = exportData;
					this.launcher.store.requestSave();

					if(this.mainWindow) {
						this.mainWindow.webContents.send('statistics', {
							game: curr,
							data: exportData
						});
					}
				});

				prev[curr] = stat;
				return prev;
			}, {});

			if(this.tray) this.tray.setContextMenu(this.getMenu());
		});

		this.on('logout', () => {
			this.stats = {};
			if(this.tray) this.tray.setContextMenu(this.getMenu());
		});

		this.on('launch', () => {
			switch(this.launcher.store.state.config.general.afterLaunch) {
				case 'close':
					this.beforeExit(true);
					break;

				case 'minimize':
					if(this.mainWindow) this.mainWindow.minimize();
					break;

				case 'tray':
					if(this.mainWindow) this.mainWindow.close();
					break;
			}
		});

		if(this.launcher.loggedIn) this.emit('login');
	}

	async launch({game, args}) {
		if(!this.games[game]) return;
		if(this.monitor.isRunning(game)) return;

		try {
			await this.launcher.launchGame(game, args);
			this.monitor.monitorGame(this.games[game], args);
			this.emit('launch');
		} catch(err) {
			this.logError(err);

			if(err.nexodusName === 'LoginFailed') {
				this.removeAllListeners('login.ui');
				await this.showLogin();

				this.on('login.ui', () => {
					this.launch({game, args});
				});
			}
		}
	}

	registerGame(game) {
		this.games[game.id] = game;
	}

	registerGames() {
		games.forEach(game => this.registerGame(game));
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
				title: "Nexodus",
				webPreferences: {
					nodeIntegration: true
				}
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

	getMenu() {
		return Menu.buildFromTemplate([
			...this.getTrayGames(),

			{ type: 'separator' },

			{
				label: '열기',
				click: () => {
					this.show();
				}
			},

			{
				label: '종료',
				click: () => {
					this.beforeExit();
				}
			}
		]);
	}

	getTrayGames() {
		const allStats = this.launcher.store.state.stats || {};
		if(!this.launcher.id) return [];

		const stats = allStats[this.launcher.id];
		if(!stats) return [];

		return Object.keys(stats)
			.sort((n1, n2) => {
				const v1 = stats[n1];
				const v2 = stats[n2];

				if(!v1.recent && v2.recent) return 1;
				if(!v2.recent && v1.recent) return -1;
				if(!v1.recent && !v2.recent) return 0;

				return v2.recent - v1.recent;
			})
			.map(gameName => {
				const game = this.games[gameName];

				if(game.fastStartEnabled) {
					if(game.getNames) {
						return {
							label: game.getName(),
							submenu: game.getNames().map(({name, launchArgs}) => {
								return {
									label: name,
									click: () => {
										this.launch({
											game: game.id,
											args: launchArgs
										});
									}
								};
							})
						};
					}

					return {
						label: game.getName(),
						click: () => {
							this.launch({
								game: game.id
							});
						}
					};
				}

				return {
					label: game.getName(),
					click: async () => {
						await this.showLauncher();
						this.mainWindow.webContents.send('showGame', game.id);
					}
				};
			});
	}

	log(text) {
		//TODO
		console.log(text);
	}

	logError(err) {
		console.error(err);
	}

	showPrompt(title, desc, callbackEvent) {
		dialog.showMessageBox({
			type: 'none',
			buttons: ['예', '아니오'],
			title,
			message: desc
		}, resp => {
			const response = !resp;

			this.emit(callbackEvent, response);
		});
	}

	async beforeExit(force=false) {
		const runningGames = Object.keys(this.games).filter(game => this.monitor.isRunning(game));

		if(!force) {
			if(runningGames.length > 0) {
				this.showPrompt(
					'종료하시겠습니까?',
					'아직 실행중인 게임이 있습니다. 종료하시겠습니까?\n종료하실 경우 현재 플레이는 통계에 반영되지 않습니다.',
					'exitPrompt'
				);
				return;
			}
		}

		runningGames.forEach(k => {
			this.monitor.stopGame(k);
		});

		await this.launcher.store.save();

		if(this.mainWindow) this.mainWindow.close();
		if(this.loginWindow) this.loginWindow.close();

		app.quit();
	}
}

module.exports = Nexodus;
