import FormAPI from '../FormAPI';
import assert from 'assert';

export default class ClientFormAPI extends FormAPI {
	/**
	 * ClientFormAPI constructor
	 * @param id {String} Form id
	 * @type {ClientFormAPI}
	 */
	constructor(id, options = {}) {
		super(id, options);

		const form = global.document[id];
		assert(form, `Form with id ${id} doesn't exists.`);

		this.form = form;
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
