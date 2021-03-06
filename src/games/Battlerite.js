const querystring = require('querystring');

const CSON = require('cson');
const {ErrorServer} = require('../utils/Errors');

const Battlerite = {
	async getStartArgs(launcher, isRoyale) {
		const {data: startGameToken} = await launcher.axios.post(
			'http://battlerite.nexon.com/Common/GameStartControl',

			querystring.stringify({
				isRoyale: +isRoyale
			}),

			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Cookie': launcher.cookieText,
					'Referer': this.referer
				}
			}
		);

		const objMatch = startGameToken.match(/PS\.game\.startGame\(([^)]*)\)/);
		if(!objMatch) throw new ErrorServer();

		const startObject = CSON.parse(objMatch[1]);

		return {
			game: startObject.gameCode + ':0',
			arg: startObject.param
		};
	},

	getExecutable(isRoyale) {
		if(isRoyale) {
			return 'BattleriteRoyale.exe'
		}

		return 'Battlerite.exe';
	},

	getName() {
		return 'Battlerite';
	},

	getNames() {
		return [
			{
				name: 'Battlerite Arena',
				launchArgs: false
			},

			{
				name: 'Battlerite Royale',
				launchArgs: true
			}
		];
	},

	get fastStartEnabled() {
		return true;
	},

	get id() {
		return 'battlerite';
	},

	get referer() {
		return 'http://battlerite.nexon.com/Main/Index';
	},

	get gameWeb() {
		return 'http://battlerite.nexon.com';
	}
};

module.exports = Battlerite;
