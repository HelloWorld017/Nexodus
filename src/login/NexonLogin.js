const crypto = require('crypto');
const querystring = require('querystring');
const {xml2js} = require('xml-js');

const {ErrorLoginFailed, ErrorServer, ErrorWrongCredential} = require('../utils/Errors');
const {NgbRSA} = require('./NgbRSA');


class NexonLogin {
	constructor(launcher) {
		this.launcher = launcher;
		this.axios = launcher.axios;

		this.hardcodedHashKey = Buffer.from('4E65786F6E55736572', 'hex');
		this.hashKey = {};
		this.rsaKey = {};
		this.referer = 'https://nxlogin.nexon.com/common/login.aspx';
	}

	async parseNxml(url) {
		const {data: nxml} = await this.axios.get(url, {
			headers: {
				Referer: this.referer
			}
		});

		const xml = nxml.replace(/^.*\('/, '').replace(/'\);$/, '');
		const root = xml2js(xml);

		const parseObject = (parsed, object) => {
			if(!parsed.elements) return;

			parsed.elements.forEach(v => {
				let result = undefined;

				switch(v.name) {
					case 'object':
						result = parseObject(v, {});
						break;

					case 'number':
						result = parseFloat(v.attributes.value);
						break;

					case 'string':
						result = v.attributes.value;
						break;
				}

				object[v.attributes.name] = result;
			});

			return object;
		};

		return parseObject(root.elements[0], {});
	}

	async initLogin() {
		this.hashKey = await this.getHashKey();
		this.hmac = crypto.createHmac('sha256', this.hashKey.hashKey);

		this.rsaKey = await this.getRSAKey();
	}

	async login(id, password, isFirstHashed=false) {
		await this.initLogin();

		const payload = [id, this.hashPassword(password, isFirstHashed)];
		const body = {
			strEncData: this.encryptPayload(payload),
			codeRegSite: 0
		};

		const {headers, data} = await this.axios.post(
			'https://login.nexon.com/login/page/loginproc.aspx',
			querystring.stringify(body),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Referer': this.referer
				}
			}
		);

		if(data.includes('ErrorCode')) {
			const code = data.match(/ErrorCode=(\d+)/);
			if(!code) throw new ErrorServer();

			const errorCode = parseInt(code[1]);

			throw this.getErrorMessage(errorCode);
		}

		const cookies = headers['set-cookie'];
		const cookie = {};

		cookies.forEach(v => {
			const cookieSplit = v.split(';')[0].split('=');
			const cookieName = cookieSplit[0];

			cookie[cookieName] = cookieSplit[1];
		});

		return cookie;
	}

	hashPassword(password, isFirstHashed) {
		let firstHash = password;

		if(!isFirstHashed) {
			firstHash = this.firstHashPassword(password);
		}

		this.hmac.update(result2);

		return this.hashKey.header + this.hmac.digest('hex').toUpperCase();
	}

	firstHashPassword(password) {
		const hmac2 = crypto.createHmac('sha256', this.hardcodedHashKey);
		const hmac2.update(password);

		return hmac2.digest('hex').toUpperCase();
	}

	encryptPayload(payload) {
		let payloadString = this.rsaKey.h ? this.rsaKey.h + '\\' : '';
		payloadString += payload.map(v => Buffer.from(v).toString('base64')).join('\\');

		// crypto RSA Implementation doesn't work (maybe because of padding mode?)
		const keyPair = new NgbRSA.RSAKeyPair(this.rsaKey.e, '', this.rsaKey.m);
		return NgbRSA.encryptedString(keyPair, payloadString);
	}

	async getHashKey() {
		const callbackName = Math.floor(Math.random() * 9e+7) + 1e+7;
		const {PasswordHashKeyString: hashKey} =
			await this.parseNxml('https://sso.nexon.com/Ajax/Default.aspx?_vb=GetPasswordHashKey&_cs=' + callbackName);

		if(!hashKey) throw new ErrorServer();

		const hashKeySplit = hashKey.split(':');

		return {
			hashKey: hashKeySplit.pop(),
			header: hashKeySplit.join(':') + ':'
		};
	}

	async getRSAKey() {
		const {result: rsaKey} = await this.parseNxml('https://login.nexon.com/login/page/encryptinfo.aspx');
		/*rsaKey.key = new NodeRSA();
		rsaKey.key.importKey({
			n: Buffer.from(rsaKey.m, 'hex'),
			e: parseInt(rsaKey.e, 16)
		}, 'components-public');
		rsaKey.pem = rsaKey.key.exportKey('public');*/

		if(!rsaKey || !rsaKey.e || !rsaKey.m) throw new ErrorServer();

		return rsaKey;
	}

	getErrorMessage(errorCode) {
		switch(errorCode) {
			case 1:
			case 2:
			case 101:
			case 102:
			case 105:
				return new ErrorWrongCredential();

			case 3:
			case 103:
				return new ErrorLoginFailed("관리자에 의해 서비스 이용이 제한되었습니다.");

			case 4:
				return new ErrorLoginFailed("로그인을 10회 이상 실패하여 10분간 로그인이 중지됩니다.");

			case 21:
			case 5:
				return new ErrorLoginFailed("넥슨ID 보호를 위해 일시적으로 로그인이 제한되었습니다.");

			case 6:
				return new ErrorLoginFailed("시스템 장애로 로그인에 실패하였습니다.");

			case 7:
				return new ErrorLoginFailed("이메일 형태의 넥슨ID를 입력해주세요.");

			case 9:
				return new ErrorLoginFailed("일회용 로그인 번호가 일치하지 않습니다.");

			case 10:
				return new ErrorLoginFailed(
					"잘못된 요청으로 24시간 동안 이용이 제한됩니다.\n" +
					"서비스 이용을 원하신다면 넥슨ID와 비밀번호로 로그인해주시기 바랍니다."
				);

			case 17:
				return new ErrorLoginFailed("넥슨 서비스 이용을 위해서는 이메일이 필요합니다.");

			case 18:
				return new ErrorLoginFailed("사용할 수 없는 이메일 정보입니다. 이메일 정보 변경 후 다시 시도해주세요.");

			case 19:
				return new ErrorLoginFailed("사용할 수 없는 이메일 정보입니다. 이메일 정보 인증 후 다시 시도해주세요.");

			case 20:
				return new ErrorLoginFailed("일회용 로그인이 제한된 IP입니다. 넥슨 ID와 비밀번호로 로그인해주세요.");
		}

		return new ErrorLoginFailed();
	}
}

module.exports = NexonLogin;
