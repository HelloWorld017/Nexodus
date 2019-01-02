class NexodusError extends Error {
	constructor(message) {
		super(message);

		this.isNexodusError = true;
	}
}

class ErrorLoginFailed extends NexodusError {
	constructor(message) {
		super(message || "로그인에 실패하였습니다.");
		this.nexodusName = 'LoginFailed';
	}
}

class ErrorServer extends NexodusError {
	constructor() {
		super("서버에서 잘못된 응답을 받았습니다.");
		this.nexodusName = 'Server';
	}
}

class ErrorUnknown extends NexodusError {
	constructor() {
		super("알 수 없는 오류가 발생하였습니다.");
		this.nexodusName = 'Unknown';
	}
}

class ErrorWrongCredential extends NexodusError {
	constructor() {
		super("ID 혹은 비밀번호를 다시 확인해주세요!");
		this.nexodusName = 'WrongCredential';
	}
}

module.exports = {ErrorLoginFailed, ErrorServer, ErrorUnknown, ErrorWrongCredential};
