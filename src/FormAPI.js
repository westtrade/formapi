const DEFAULT_SETTINGS = require('./defaults');
let global_settings = Object.assign({}, DEFAULT_SETTINGS);

class FormAPI {
	constructor(id, options = {}) {
		this.properties = {
			id, options,
		}
	}

	static settings(settings) {
		if (!settings) {
			return global_settings;
		}

		global_settings = Object.assign({}, DEFAULT_SETTINGS, settings);
	}

	files() {

	}

	validate() {

	}

	submit(override = {}) {
		return new Promise((resolve, reject) => {

		});
	}

	on(name, listener = (event) = {}) {
		return this;
	}

	off(name) {
		return this;
	}

	field(name, data) {
		if (!data) {
			return
		}
	}

	fields(data = {}) {
		Object.entries(data).forEach(([key, value]) => {
			this.field(key, value);
		});
	}
}

module.exports = FormAPI;
