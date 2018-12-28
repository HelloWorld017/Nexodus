const fs = require('fs');
const {machineId} = require('node-machine-id');
const {promisify} = require('util');

class UserStore {
	constructor() {
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
		this.cpu =  os.cpus().pop().model;
		this.memory = os.totalmem();
		this.homedir = os.homedir();
		this.hostname = os.hostname();

		this.derivedHash = null;
		this.storeInitiated = false;
		this.state = {};
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
		} catch(e) {}

		try {
			this.state = await this.load();
		} catch(e) {}
	}

	async load() {
		const {encrypted, iv} = await promisify(fs.readFile)('./data/config.json', 'utf8');
		const decipher = crypto.createDecipheriv('aes-256-cbc', this.derivedHash, iv);

		let decrypted = decipher.update(encrypted, 'base64', 'utf8');
		decrypted += decipher.final('utf8');

		return JSON.parse(decrypted);
	}

	async save() {
		const decrypted = JSON.stringify(this.state);
		const iv = await promisify(crypto.randomBytes)(16);
		const cipher = crypto.createCipheriv('aes-256-cbc', this.derivedHash, iv);

		let encrypted = cipher.update(decrypted, 'utf8', 'base64');
		encrypted += cipher.final('utf8');

		await promisify(fs.writeFile)('./data/config.json', encrypted);
	}

	get keyString() {
		return this.mac + this.cpu + this.memory + this.homedir + this.hostname;
	}
}

module.exports = UserStore;
