import	DEFAULT_SETTINGS from './defaults';
import assert from 'assert';

let global_settings = Object.assign({}, DEFAULT_SETTINGS);

export default class FormAPI {
	/**
	 * FormAPI constructor
	 * @type {String} Form id
	 * @type {Object} Form options
	 */
	constructor(id, options = {}) {
		assert(id && typeof id === 'string' && id.length, 'Form id must be a string');
		this.properties = {
			id, options,
		};
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

	fields(data = null) {


		Object.entries(data).forEach(([key, value]) => {
			this.field(key, value);
		});
	}
}
