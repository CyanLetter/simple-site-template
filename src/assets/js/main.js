import { Example } from './site/ExampleClass.js';

class Main {
	constructor() {
		console.log("Starting App");
		window.app = this;

		this.init();
	}

	init() {
		new Example();
	}
}

window.onload = function() {
	new Main();
}

// Reserved for quit events
window.onbeforeunload = function() {
	
}