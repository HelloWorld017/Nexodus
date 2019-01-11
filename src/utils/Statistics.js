const moment = require('moment');
moment.locale('ko');

const EventEmitter = require('events');

class Statistics extends EventEmitter {
	constructor(game) {
		super();
		this.game = game;
		this.first = null;
		this.recent = null;
		this.total = 0;
		this.currentWeek = 0;
		this.lastUpdated = Date.now();
		this.elapsedDate = 1;
	}

	playedTime(mins) {
		const hrs = mins / 60;

		this.currentWeek += hrs;
		this.total += hrs;

		this.emit('updateStatistics');
	}

	startedGame() {
		this.recent = Date.now();
		if(!this.first) this.first = this.recent;

		this.elapsedDate = 1;
		this.emit('updateStatistics');
	}

	updateStatistics() {
		const current = moment();
		const lastUpdated = moment(this.lastUpdated);

		const currentWeek = current.week();
		const currentYear = current.year();

		const lastWeek = lastUpdated.week();
		const lastYear = lastUpdated.year();

		let elapsedWeek = 0;
		for(let y = lastYear; y < currentYear; y++) {
			elapsedWeek += moment(`${y}-01-01`).weeksInYear();
		}
		elapsedWeek += currentWeek - lastWeek;

		if(elapsedWeek > 0) {
			this.currentWeek = 0;
		}

		let updated = false;
		if(current.diff(lastUpdated, 'day') > 0) {
			this.elapsedDate = current.diff(moment(this.first), 'day') + 1;
			updated = true;
		}

		this.lastUpdated = current.valueOf();

		if(updated) {
			this.emit('updateStatistics');
		}
	}

	static importData(game, data) {
		const stats = new Statistics(game);

		stats.first = data.first;
		stats.recent = data.recent;
		stats.total = data.total;
		stats.currentWeek = data.currentWeek;
		stats.lastUpdated = data.lastUpdated;
		stats.updateStatistics();

		return stats;
	}

	exportData() {
		return {
			first: this.first,
			recent: this.recent,
			elapsedDate: this.elapsedDate,
			total: this.total,
			currentWeek: this.currentWeek,
			lastUpdated: this.lastUpdated
		};
	}
}

module.exports = Statistics;
