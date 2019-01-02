const axios = require('axios');
const deepmerge = require('deepmerge');
const defaultConfigs = require('./utils/configs');
const opn = require('opn');

const {ErrorLoginFailed} = require('./utils/Errors');
const NexonLogin = require('./login/NexonLogin');
const UserStore = require('./utils/UserStore');


class Launcher {
	constructor(games) {
		this.axios = axios.create({
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
			}
		});

		this.nexonLogin = new NexonLogin();
		this.games = games;
		this.cookie = {};
		this.store = new UserStore();

		this.id = null;
		this.username = null;
		this.passwordHash = null;
		this.loggedIn = false;
	}

	async init() {
		await this.store.init();

		if(this.store.state.id) {
			this.id = this.store.state.id;
		}

		if(this.store.state.password) {
			this.passwordHash = this.store.state.password;
		}

		this.store.state.config = deepmerge(defaultConfig, this.store.state.config || {}, {
			arrayMerge: (dest, source) => source
		});

		try {
			await this.loginFromSaved();
			this.loggedIn = true;
		} catch(e) {}
	}

	async login(id, password, saveEmail=true, saveLogin=true) {
		const firstHash = this.nexonLogin.firstHashPassword(password);

		if(saveLogin && saveEmail){
			this.store.state.password = this.passwordHash;
		}

		if(saveEmail) {
			this.store.state.id = this.id = id;
			await this.store.state.save();
		}

		this.id = id;
		this.passwordHash = firstHash;

		return await this.loginFromSaved();
	}

	async loginFromSaved() {
		const cookie = await this.nexonLogin.login(this.id, this.passwordHash, true);

		Object.keys(cookie).forEach(key => {
			this.cookie[key] = cookie[key];
		});

		//TODO return username
		//TODO set username
	}

	async getA2SK() {
		const {data: pjson} = await axios.get('http://act.nexon.com/act.nhs?_vb=GetSessionID&callback=callback', {
			headers: {
				Referer: this.referers['login']
			}
		});

		const jsonString = pjson.replace(/^callback\(/, '').replace(/\);?$/, '');
		const {response: a2skSetter} = JSON.parse(jsonString);

		return a2skSetter.A2SK;
	}

	forget(forgetEmail=true, forgetPassword=true) {
		//TODO
	}

	async createLaunchURI(gameId, launchArgs) {
		if(!this.cookie['NPP']) throw new ErrorLoginFailed();

		try {
			this.cookie['A2SK'] = await this.getA2SK();
		} catch(e) {
			throw new ErrorServer();
		}

		const configuration = Object.assign(
			{},
			this.getDefaultLaunchConfiguration(this.game[gameId]),
			this.games[gameId].getStartArgs(launchArgs, this)
		);

		return `ngm://launch/ ${this.generateArgString(configuration)}`;
	}

	generateArgString(args) {
		const argString = Object.keys(args).map(arg => `-${arg}:${args[arg]}`).join(' ');

		return encodeURIComponent(argString);
	}

	getDefaultLaunchConfiguration(game) {
		return {
			dll: 'platform.nexon.com/NGM/Bin/NGMDll.dll:1',
			locale: 'KR',
			mode: 'launch',
			token: this.cookie['NPP'],
			timestamp: Date.now(),
			a2sk: this.cookie['A2SK'],
			position: `GameWeb|${game.gameWeb}`
		};
	}

	launchGame(gameId, launchArgs) {
		try {
			await this.loginFromSaved();
		} catch(e) {
			throw new ErrorLoginFailed();
		}

		opn(await this.createLaunchURI(gameId, launchArgs));
	}
}

module.exports = Launcher;
