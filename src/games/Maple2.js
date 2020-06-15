const Maple2 = {
	async getStartArgs(launcher) {
		return {
			game: '106498:0'
		};
	},

	getExecutable() {
		return 'MapleStory2.exe';
	},

	getName() {
		return 'MapleStory2';
	},

	get fastStartEnabled() {
		return true;
	},

	get id() {
		return 'maple2';
	},

	get referer() {
		return 'http://maplestory2.nexon.com';
	},

	get gameWeb() {
		return 'http://maplestory2.nexon.com';
	}
};

module.exports = Maple2;
