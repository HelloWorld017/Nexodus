const {app} = require('electron');
const crypto = require('crypto');
const {exists} = require('./utils');
const fs = require('fs');
const {machineId} = require('node-machine-id');
const os = require('os');
const path = require('path');
const {promisify} = require('util');

class UserStore {
	constructor(launcher) {
		const network = os.networkInterfaces();
		this.macs = Object.keys(network).map(k => {
			const mac = network[k].reduce((prev, curr) => {
				if(prev) return prev;

				if(curr.mac !== 'ff:00:00:00:00:00' && curr.mac !== '00:00:00:00:00:00') {
					return curr.mac;
				}

				return null;
			}, null);

			return mac;
		}).filter(v => v);

		this.mac = this.macs.length < 1 ? '' : this.macs.pop();
		this.cpu =  os.cpus().pop().model.trim();
		this.memory = os.totalmem();
		this.homedir = os.homedir();
		this.hostname = os.hostname();

		this.derivedHash = null;
		this.storeInitiated = false;
		this.state = {};

		// These targets are tend to be reset easily.
		this.encryptTarget = ['id', 'password'];

		this.launcher = launcher;
		this.lastSaveRequest = Date.now();

		this.configPath = path.resolve(app.getPath('userData'), 'config.json');

		this.obfKey = Buffer.from('4EA817B59CA295524EEAAC7EFCA53718BB258D2627FDFB9A76AD3E7830A7BC71', 'hex');
	}

	async init() {
		try {
			const uuid = await machineId();

			this.derivedHash = await new Promise((resolve, reject) => {
				crypto.pbkdf2(this.keyString, uuid, 103782, 32, 'sha512', (err, derivedKey) => {
					if(err) return reject(err);

					resolve(derivedKey);
				});
			});

			this.storeInitiated = true;
		} catch(e) {
			this.launcher.nexodus.logError(e);
		}

		try {
			const configDir = path.dirname(this.configPath);

			if(!await exists(configDir)) {
				await promisify(fs.mkdir)(configDir);
			}

			this.state = await this.load();
		} catch(e) {
			this.launcher.nexodus.logError(e);
		}
	}

	async load() {
		if(!await exists(this.configPath))
			return {};

		const {encStore, store} = JSON.parse(await promisify(fs.readFile)(this.configPath, 'utf8'));

		let decrypted = {};

		try {
			const {encrypted, iv} = encStore;
			const decipher = crypto.createDecipheriv('aes-256-cbc', this.derivedHash, Buffer.from(iv, 'hex'));
			let decryptedStr = decipher.update(encrypted, 'base64', 'utf8');
			decryptedStr += decipher.final('utf8');
			decrypted = JSON.parse(decryptedStr);
		} catch(err) {
			this.launcher.nexodus.logError(err);
		}

		let storeDecrypted = {};

		try {
			const {encrypted: storeEncrypted} = store;
			const storeDecipher = crypto.createDecipheriv('aes-256-cbc', this.obfKey, Buffer.alloc(16));
			let storeDecryptedStr = storeDecipher.update(storeEncrypted, 'base64', 'utf8');
			storeDecryptedStr += storeDecipher.final('utf8');
			storeDecrypted = JSON.parse(storeDecryptedStr)
		} catch(err) {
			this.launcher.nexodus.logError(err);
		}

		return Object.assign({}, decrypted, storeDecrypted);
	}

	async save() {
		this.lastSaveRequest = Date.now();

		// Separating state to encStore and store
		const encStore = {};
		const store = {};

		Object.keys(this.state).forEach(key => {
			if(this.encryptTarget.includes(key)) {
				encStore[key] = this.state[key];
				return;
			}

			store[key] = this.state[key];
		});

		// Encrypting encStore in order to store privacy-related information.
		const iv = await promisify(crypto.randomBytes)(16);
		const cipher = crypto.createCipheriv('aes-256-cbc', this.derivedHash, iv);
		let encrypted = cipher.update(JSON.stringify(encStore), 'utf8', 'base64');
		encrypted += cipher.final('base64');

		// Encrypting store in order to make file obscure and hard to edit
		const storeCipher = crypto.createCipheriv('aes-256-cbc', this.obfKey, Buffer.alloc(16));
		let storeEncrypted = storeCipher.update(JSON.stringify(store), 'utf8', 'base64');
		storeEncrypted += storeCipher.final('base64');

		await promisify(fs.writeFile)(this.configPath, JSON.stringify({
			warning: "주의! 이 파일을 다른 사람에게 공유하지 마세요. 비밀번호 등이 포함된 파일입니다.",
			encStore: {
				encrypted,
				iv: iv.toString('hex')
			},

			store: {
				encrypted: storeEncrypted
			}
		}, null, '\t'));
	}

	requestSave() {
		const timestamp = Date.now();
		this.lastSaveRequest = timestamp;

		setTimeout(() => {
			if(this.lastSaveRequest === timestamp) this.save();
		}, 1000);
	}

	get keyString() {
		return this.mac + this.cpu + this.memory + this.homedir + this.hostname;
	}
}

module.exports = UserStore;
