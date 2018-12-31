export default {
	general: {
		runOnStartup: {
			name: '시작 시 실행',
			desc: '윈도우 시작 시 Nexodus를 실행시킵니다.',
			type: 'boolean'
		},

		runAsMinimized: {
			name: '최소화 된 상태로 실행',
			desc: '윈도우 시작 시 시스템 트레이에 최소화된 상태로 실행시킵니다.',
			type: 'boolean',
			level: 1,
			requirements: 'runOnStartup'
		},

		allowMultipleExecution: {
			name: '다중실행 지원',
			desc: '여러 개의 Nexodus가 실행되는 것을 허용합니다.',
			type: 'boolean'
		},

		closeMeansMinimize: {
			name: '종료 시 동작',
			desc: '닫기 버튼을 누르는 등 프로그램을 종료할 시 실행할 작업을 선택합니다.',
			type: 'enum',
			enums: [
				{
					name: '완전히 종료',
					value: false
				},

				{
					name: '시스템 트레이로 최소화',
					value: true
				}
			]
		},

		quitAfterLaunch: {
			name: '게임 실행 후 종료',
			desc: '게임을 실행시킨 후에 프로그램 종료 작업을 수행합니다.',
			type: 'boolean'
		}
	},

	security: {
		saveEmail: {
			name: '이메일 저장',
			desc: '로그인 시에 로그인 한 이메일을 저장합니다.',
			type: 'boolean',
			onHandle: 'saveEmail'
		},

		saveLogin: {
			name: '자동 로그인',
			desc: '프로그램 실행 시 자동으로 로그인합니다.',
			type: 'boolean',
			level: 1,
			requirements: 'saveEmail',
			onHandle: 'saveLogin'
		}
	}
};
