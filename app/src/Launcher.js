class Launcher {
	constructor(electron, store) {
		this.electron = electron;
		this.store = store;

		this.electron.ipcRenderer.on('statistics', (evt, stats) => {
			this.store.commit('statisticsGameSet', stats);
		});
	}

	retrieveSettings() {
		return new Promise(resolve => {
			this.electron.ipcRenderer.once('getInfo', (evt, config) => {
				resolve(config);
			});
			this.electron.ipcRenderer.send('getInfo');
		});
	}

	login(id, password) {
		return new Promise((resolve, reject) => {
			this.electron.ipcRenderer.once('login', (evt, res) => {
				if(res.result) {
					resolve(res);
				} else {
					reject(res);
				}
			});
			this.electron.ipcRenderer.send('login', {id, password});
		});
	}

	logout() {
		this.electron.ipcRenderer.send('logout');
	}

	launch(game, args) {
		this.electron.ipcRenderer.send('launch', {game, args});
	}

	homepage(gameName) {
		this.electron.ipcRenderer.send('homepage', gameName);
	}
}

export default Launcher;
