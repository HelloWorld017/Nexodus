import {remote} from 'electron';

class WindowHandle {
	constructor() {
		this.window = remote.getCurrentWindow();
	}

	minimize() {
		this.window.minimize();
	}

	maximize() {
		if(!this.window.isMaximized()) {
			this.window.maximize();
			return;
		}

		this.window.unmaximize();
	}

	exit() {
		this.window.close();
	}
}

export default WindowHandle;
