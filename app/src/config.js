export default {
	general: {
		enableTray: {
			name: '시스템 트레이 사용',
			desc: '시스템 트레이에 Nexodus를 추가합니다. 켜져 있지 않을 시 시스템 트레이와 관련된 옵션은 적용되지 않을 것입니다.',
			type: 'boolean'
		},

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
			requirements: ['runOnStartup']
		},

		/* allowMultipleExecution: {
			name: '다중실행 지원',
			desc: '여러 개의 Nexodus가 실행되는 것을 허용합니다.',
			type: 'boolean'
		}, */

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

		afterLaunch: {
			name: '게임 실행 후 동작',
			desc: '게임을 실행시킨 후에 실행할 작업을 선택합니다.',
			type: 'enum',
			enums: [
				{
					name: '완전히 종료',
					value: 'close'
				},

				{
					name: '시스템 트레이로 최소화',
					value: 'tray'
				},

				{
					name: '작업 표시줄로 최소화',
					value: 'minimize'
				},

				{
					name: '가만히 있기',
					value: 'none'
				}
			]
		}
	},

	security: {
		saveEmail: {
			name: '이메일 저장',
			desc: '로그인 시에 로그인 한 이메일을 저장합니다.',
			type: 'boolean'
		},

		saveLogin: {
			name: '자동 로그인',
			desc: '프로그램 실행 시 자동으로 로그인합니다.',
			type: 'boolean',
			level: 1,
			requirements: ['saveEmail']
		}
	}
};
