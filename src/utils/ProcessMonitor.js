const psList = require('ps-list');

const EventEmitter = require('events');

class ProcessMonitor extends EventEmitter {
	constructor(nexodus) {
		super();
		this.nexodus = nexodus;
		this.monitoring = {};
		this.running = [];
	}

	monitorGame(game, args) {
		this.nexodus.log('Start monitoring ' + this.normalizeExecutable(game.getExecutable(args)));

		this.monitoring[game.id] = {
			target: this.normalizeExecutable(game.getExecutable(args)),
			started: 0
		};
	}

	isRunning(gameId) {
		return this.monitoring[gameId] && this.monitoring[gameId].started;
	}

	normalizeExecutable(name) {
		return name.toLowerCase().replace(/\.exe$/, '');
	}

	stopGame(gameKey) {
		const {started} = this.monitoring[gameKey];

		this.emit('end', {
			gameName: gameKey,
			runningTime: Date.now() - started
		});

		// delete this.monitoring[gameKey];
		// Sometimes, the game restarts.

		this.monitoring[gameKey].started = 0;
	}

	async checkUpdate() {
		const list = await psList();

		Object.keys(this.monitoring).forEach(key => {
			const {target, started} = this.monitoring[key];
			const running = list.find(({name}) => this.normalizeExecutable(name) === target);

			if(started && !running) {
				this.stopGame(key);
			} else if (!started && running) {
				this.monitoring[key].started = Date.now();

				this.emit('start', {
					gameName: key,
					startedTime: this.monitoring[key].started
				});
			}
		});
	}
}

module.exports = ProcessMonitor;
