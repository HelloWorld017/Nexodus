export default electron => store => {
	store.subscribe(({type, payload}) => {
		switch(type) {
			case 'configUpdate':
				electron.ipcRenderer.send('config', payload);
				break;

			case 'activatedGamesSet':
				electron.ipcRenderer.send('config', {
					section: 'activatedGames',
					value: payload
				});
				break;
		}
	});
};
