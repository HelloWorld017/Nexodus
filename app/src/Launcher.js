class Launcher {
	constructor(electron) {
		this.electron = electron;
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

	openLauncher() {
		this.electron.ipcRenderer.send('openLauncher');
	}

	logout() {

	}

	launch(gameName, options) {

	}

	homepage(gameName) {

	}
}

export default Launcher;
