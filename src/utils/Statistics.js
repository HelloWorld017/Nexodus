const moment = require('moment');

const EventEmitter = require('events');

class Statistics extends EventEmitter {
	constructor(game) {
		super();
		this.game = game;
		this.recent = null;
		this.weeks = [];
		this.total = 0;
		this.currentWeek = 0;
		this.lastUpdated = Date.now();
	}

	playedTime(mins) {
		const hrs = mins / 60;

		this.currentWeek += htd;
		this.total += htd;
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

		let updated = false;
		if(elapsedWeek > 0) {
			this.weeks.push(this.currentWeek);
			this.currentWeek = 0;
			updated = true;
			elapsedWeek -= 1;
		}

		this.weeks = this.weeks.concat([...Array(elapsedWeek)].map(v => 0));
		this.lastUpdated = current.valueOf();

		if(updated) {
			this.emit('updateStatistics');
		}
	}

	static importData(game, data) {
		const stats = new Statistics(game);

		stats.recent = data.recent;
		stats.weeks = data.weeks;
		stats.total = data.total;
		stats.currentWeek = data.currentWeek;
		stats.lastUpdated = data.lastUpdated;
		stats.updateStatistics();

		return stats;
	}

	exportData() {
		return {
			recent: this.recent,
			weeks: this.weeks,
			total: this.total,
			currentWeek: this.currentWeek,
			lastUpdated: this.lastUpdated
		};
	}
}

module.exports = Statistics;
