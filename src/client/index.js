import FormAPI from '../FormAPI';
import assert from 'assert';

export default class ClientFormAPI extends FormAPI {
	constructor(id, options = {}) {
		super(id, options);

		const form = global.document[id];
		assert(form, `Form with id ${id} doesn't exists.`);
		
		this.form = form;
	}
}
