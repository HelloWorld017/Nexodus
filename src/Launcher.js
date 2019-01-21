const axios = require('axios');
const deepmerge = require('deepmerge');
const defaultConfig = require('./utils/configs');
const opn = require('opn');

const {ErrorLoginFailed} = require('./utils/Errors');
const NexonLogin = require('./login/NexonLogin');
const UserStore = require('./utils/UserStore');


class Launcher {
	constructor(nexodus) {
		this.axios = axios.create({
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
			}
		});

		this.nexodus = nexodus;

		this.nexonLogin = new NexonLogin(this);
		this.games = nexodus.games;
		this.cookie = {};
		this.store = new UserStore(this);

		this.id = null;
		this.username = null;
		this.passwordHash = null;
		this.loggedIn = false;

		this.referer = 'https://www.nexon.com/Home/Game.aspx';
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
		} catch(e) {}
	}

	async login(id, password, saveEmail=true, saveLogin=true) {
		const isOld = !id.includes('@');
		const firstHash = this.nexonLogin.firstHashPassword(password);

		this.id = id;
		this.passwordHash = isOld ? password : firstHash;

		const res = await this.loginFromSaved();
		if(!res) return res;

		if(saveLogin && saveEmail) {
			this.store.state.password = this.passwordHash;
		}

		if(saveEmail) {
			this.store.state.id = this.id = id;
			await this.store.requestSave();
		}

		return res;
	}

	async loginFromSaved() {
		if(!this.id || !this.passwordHash) return;

		const cookie = await this.nexonLogin.login(this.id, this.passwordHash, true);

		Object.keys(cookie).forEach(key => {
			this.cookie[key] = cookie[key];
		});

		const {data: pjson} = await this.axios.get(
			'https://ps.nexon.com/global/usernick.aspx?_vb=GetInfo&callback=callback',
			{
				headers: {
					Referer: this.referer,
					Cookie: this.cookieText
				}
			}
		);

		const {d: userList} = this.parsePJSON(pjson);
		const [firstUser] = userList;

		this.loggedIn = true;
		this.username = firstUser.nickName;
		this.nexodus.emit('login');

		return this.username;
	}

	async getA2SK() {
		const {data: pjson} = await this.axios.get('http://act.nexon.com/act.nhs?_vb=GetSessionID&callback=callback', {
			headers: {
				Referer: this.referer
			}
		});

		const {response: a2skSetter} = this.parsePJSON(pjson);

		return a2skSetter.A2SK;
	}

	parsePJSON(pjson) {
		return JSON.parse(pjson.replace(/^callback\(/, '').replace(/\);?$/, ''));
	}

	logout() {
		this.id = null;
		this.username = null;
		this.passwordHash = null;
		this.loggedIn = false;
		this.forget(false);
		this.nexodus.emit('logout');
	}

	forget(forgetEmail=true, forgetPassword=true) {
		if(forgetEmail) {
			this.store.state.id = null;
		}

		if(forgetPassword) {
			this.store.state.password = null;
		}

		this.store.requestSave();
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
			this.getDefaultLaunchConfiguration(this.games[gameId]),
			await this.games[gameId].getStartArgs(this, launchArgs)
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

	async launchGame(gameId, launchArgs) {
		let username = null;
		try {
			username = await this.loginFromSaved();
		} catch(e) {
			throw new ErrorLoginFailed(e.message);
		}

		if(!username) throw new ErrorLoginFailed();

		return await opn(await this.createLaunchURI(gameId, launchArgs));
	}

	get cookieText() {
		return Object.keys(this.cookie).map(k => `${k}=${this.cookie[k]}`).join('; ') + ';';
	}
}

module.exports = Launcher;
