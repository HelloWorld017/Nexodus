const KartRider = {
	async getStartArgs(launcher) {
		return {
			game: '73985:0'
		};
	},

	getExecutable() {
		return 'KartRider.exe';
	},

	getName() {
		return 'KartRider';
	},

	get fastStartEnabled() {
		return true;
	},

	get id() {
		return 'kartrider';
	},

	get referer() {
		return 'http://kart.nexon.com';
	},

	get gameWeb() {
		return 'http://kart.nexon.com';
	}
};

module.exports = KartRider;
