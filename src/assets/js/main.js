import { Example } from './site/ExampleClass.js';

import signal from 'signal-js';

class Main {
	constructor() {
		console.log("Starting App");
		window.app = this;

		this.init();
	}

	init() {
		// example sinal handling event
		signal.on('boot', (e) => this.onBoot(e));

		new Example();
	}

	onBoot(e) {
		console.log("booted", e);
	}
}

window.onload = function() {
	new Main();
}

// Reserved for quit events
window.onbeforeunload = function() {
	
}