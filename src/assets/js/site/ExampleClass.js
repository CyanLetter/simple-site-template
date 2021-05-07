/***************************************
	Example Class
***************************************/

export class Example {

	constructor (element) {
		this.name = "Example Var";

		this.init();
	}


	init() {
		console.log(this.name, "initialized");
	}
}