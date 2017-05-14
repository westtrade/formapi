import FormAPI from './FormAPI';
import {privates, verifyMethod} from './FormAPI';
import assert from 'assert';
import validator from 'validate.js';


const getFormData = (form) => {
	return  Object.entries(form.elements || {}).reduce(toData, {});
};

// TODO add arrays support
const toData = (result = {}, [fieldName, input]) => {

	if (fieldName !== input.name) {
		return result;
	}

	let value = input.value;
	if (input.type === 'checkbox') {
		value = input.checked;
	}

	result[fieldName] = value;
	return result;
};

export default class ClientFormAPI extends FormAPI {
	/**
	 * ClientFormAPI constructor
	 *
	 * @param id {String} Form id
	 * @param options {Object}
	 *
	 * @type {ClientFormAPI}
	 */
	constructor(formElement, options = {}) {
		super(formElement, options);

		const {document} = global;

		// TODO Prevent twice binding

		if (formElement instanceof HTMLFormElement) {
			this.form = formElement;
		} else {
			assert(typeof formElement === 'string' && formElement.length, 'Form formElement must be a string or HTMLFormElement');
			this.form = document.forms[formElement];
		}

		assert(this.form, `Form with id ${formElement} is not defined`);
		const {action, method} = this.form;

		this.action = action;
		this.method = method;

		const setPristine = (status) => {
			this[privates].pristine = status;
			this.emit('dirty', status);
		};

		this.form.addEventListener('input', async (event) => {
			if (this.isPristine) {
				setPristine(false);
			}
			this.emit('input', event);
			this.emit(`input.${event.target.name}`, event);
			await this.verifyField(event.target.name, this.options);
		}, true);

		this.form.addEventListener('focus', async (event) => {
			this.emit('focus', event);
			this.emit(`focus.${event.target.name}`, event);
		}, true);

		this.form.addEventListener('change', async (event) => {
			this.emit('change', event);
			this.emit(`change.${event.target.name}`, event);
			if (this.isPristine) {
				setPristine(false);
			}
			await this.verifyField(event.target.name);
		}, true);

		this.form.addEventListener('submit', async (event) => {
			const valid = await this.verify();
			if (!valid) {
				this.emit('error', this.errors);
			}

			if (event) {
				event.preventDefault();
			}

			this.emit('submit', event);
			return false;
		});
	}

	get isPristine() {
		return this[privates].pristine;
	}

	get isDirty() {
		return !this[privates].pristine;
	}

	get data() {
		return validator.collectFormValues(this.form);
		// return getFormData(this.form);
	}

	validationFromElements() {
		//TODO Get validation rules from elements
	}

	get classList() {
		return this.form.classList;
	}

	get element() {
		return this.form;
	}

	get elements() {
		const elements = Array.from(this.form.elements);
		return elements.map((element) => {
			const {name} = element;
			const {errors} = this;
			const rule = this.getRule(name);
			return [
				element,
				name,
				errors[name],
				rule,
			]
		})
	}

	field(fieldName, value, eventType) {
		if (typeof value === 'undefined') {
			return this.form.elements[fieldName];
		}

		const field = this.form[name];
		field.value = value;

		if (!eventType) {
			let inputEvent = new Event('input');
			field.dispatchEvent(inputEvent);

			let changeEvent = new Event('change');
			field.dispatchEvent(changeEvent);

		} else {
			let changeEvent = new Event(eventType);
			field.dispatchEvent(changeEvent);
		}

		return field;
	}

	/**
	 * Method sets focus on the form's elements
	 * @example
	 * 	const currentForm = new ClientFormAPI('login');
	 * 	currentForm.focus(); //Focuses on the first element of the form
	 *
	 * @type {ClientFormAPI}
	 */
	focus(elementId = 0) {
		const currentElement = this.form.elements[elementId];
		if (currentElement) {
			currentElement.focus();
		}

		return this;
	}
}
