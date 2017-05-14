import EventEmmiter2 from 'eventemitter2';
import assert from 'assert';
import validator from 'validate.js';
import qs from 'qs';

import	DEFAULT_SETTINGS from './defaults';
let globalSettings = Object.assign({}, DEFAULT_SETTINGS);

const ALLOWED_TYPES_OF_DEFINITIONS = [
	'formatter',
	'validator',
];


export const privates = Symbol('private properties');
export const verifyMethod = Symbol('Verify method');

export default class FormAPI extends EventEmmiter2 {
	/**
	 * FormAPI constructor
	 * @type {String} Form id
	 * @type {Object} Form options
	 */
	constructor(id, options = {}) {
		super({
			wildcard: true,
		});

		const {options: validatorOptions = {}, validation = {}} = options;
		this.options = validatorOptions;
		this.validation = validation;

		this[privates] = {
			errors: null,
			pristine: true,
			customErrors: null,
			// initial: this.data,
		};

		this.on('error', () => {});
	}

	static define(type = '', name, resolver = () => {}) {
		assert(typeof type === 'string' && type.length, 'Argument `type` is type of String and is required.');
		assert(typeof name === 'string' && name.length, 'Argument `name` is type of String and is required.');
		assert(ALLOWED_TYPES_OF_DEFINITIONS.indexOf(type) >= 0, `Argument \`type\` must be ${ALLOWED_TYPES_OF_DEFINITIONS.join(', ')}`);

		if (type === 'formatter') {
			validator.validators[name] = resolver;
			return ;
		}

		if (type === 'validator') {
			validator.validators[name] = resolver;
			return ;
		}
	}

	static settings(settings) {
		//BUG
		if (!settings) {
			return globalSettings;
		}

		globalSettings = Object.assign({}, DEFAULT_SETTINGS, settings);
	}

	async [verifyMethod](data = {}, constraint = {}, options) {
		try {
			const result = await validator
				.async(data, constraint, options || this.options);
			return null;
		} catch (errors) {
			return errors;
		}
	}

	get errors() {
		const {errors, customErrors} = this[privates];

		if (!errors && !customErrors) {
			return null;
		}

		return Object.assign({}, errors || {}, customErrors || {});
	}

	get customErrors() {
		return this[privates].customErrors;
	}

	setCustomErrors(errors) {
		if (errors) {
			const name = '#custom';
			this[privates].customErrors = {
				[name] : errors,
			};

			this.emit(`error.${name}`, errors, null);
			this.emit(`error`, errors, null, this.form);

			this.emit(`valid.${name}`, false, errors, null);
			this.emit('valid', name, false, errors, this.form);
			return
		}

		this.resetCustomErrors();
	}

	resetCustomErrors() {
		const name = '#custom';
		this[privates].customErrors = null;
		this.emit(`valid.${name}`, true, null, null);
		this.emit('valid', name, true, null, null);
	}

	get hasErrors() {
		return !!this.errors;
	}

	get isValid() {
		return !this.errors;
	}

	get data() {

	}

	value(name, value) {
		assert(typeof name === 'string' && name.length, 'Argument name is required and must be a string');
		if (value) {
			return this.setField(name, value);
		}

		return this.data[name];
	}

	field(fieldName, value) {
		if (typeof value === 'undefined') {
			return this.data[fieldName];
		}

		this.data[fieldName] = value;
		return value;
	}

	set data(data = {}) {
		assert(typeof data === 'object', 'Data must be an object');
		Object.entries(data).forEacn((name, value) => {
			this.setField(name, value);
		});
	}

	async verify(options) {
		const errors = await this[verifyMethod](this.data, this.validation, options);

		this[privates].errors = errors;

		// if (errors) {
		// 	this.emit('error', errors);
		// }

		return !this[privates].errors;
	}

	async verifyField(name, options) {
		assert(typeof name === 'string' && name.length, `Argument name is required and must be a string`);
		const fieldRule = this.getRule(name);

		if (!fieldRule) {
			//Notify if field without rule
			return
		}

		const fieldsErrors = await this[verifyMethod](this.data, fieldRule, options) || {};

		let formErrors = this[privates].errors || {};
		if (name in fieldsErrors) {
			const fieldErrors = fieldsErrors[name];
			formErrors[name] = fieldErrors;
		} else {
			delete formErrors[name];
		}

		if (!Object.keys(formErrors).length) {
			formErrors = null;
		}

		this[privates].errors = formErrors;

		if (fieldsErrors instanceof Error) {
			this.emit(`error`, fieldsErrors);
		} else if(formErrors && name in formErrors)  {

			this.emit(`error.${name}`, fieldsErrors[name], this.field(name));
			this.emit(`error`, fieldsErrors[name], null, this.form);

			this.emit(`valid.${name}`, false, fieldsErrors[name], this.field(name));
			this.emit('valid', name, false, fieldsErrors[name], this.form);
		} else {
			this.emit(`valid.${name}`, true, null, this.field(name));
			this.emit('valid', name, true, null, this.field(name));
		}
	}

	getRule(name) {
		const rule = this.validation[name] || null;
		return {[name]: rule};
	}

	files() {

	}
	//
	// validate() {
	//
	// }

	submit(override = {}) {
		return new Promise((resolve, reject) => {

		});
	}

	get errorList() {
		return Object.values(this.errors || {}).reduce((result, item) => {
			if (Array.isArray(item)) {
				return result.concat(item);
			}
			result.push(item);
			return result;
		}, []);
	}

	toString() {
		return qs.stringify(this.data);
	}

	toJSON() {
		return this.data;
	}
}
