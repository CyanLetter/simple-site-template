/***************************************
	Example Class
***************************************/
import signal from 'signal-js';

export class Example {

	constructor (element) {
		this.name = "Example Var";

		this.init();
	}


	init() {
		console.log(this.name, "initialized");

		// emit signal to be picked up in main.js
		signal.emit('boot', "Example Class");
	}
}