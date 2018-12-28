class ErrorLoginFailed extends Error {
	constructor(message) {
		super(message || "로그인에 실패하였습니다.");
	}
}

class ErrorServer extends Error {
	constructor() {
		super("서버에서 잘못된 응답을 받았습니다.");
	}
}

class ErrorUnknown extends Error {
	constructor() {
		super("알 수 없는 오류가 발생하였습니다.");
	}
}

class ErrorWrongCredential extends Error {
	constructor() {
		super("ID 혹은 비밀번호를 다시 확인해주세요!");
	}
}

module.exports = {ErrorLoginFailed, ErrorServer, ErrorUnknown, ErrorWrongCredential};
