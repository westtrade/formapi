import FormAPI from '../FormAPI';

class ServerFormAPI extends FormAPI {
	constructor(id, request, options = {}) {
		super(id, options);
	}

	async parse(request) {

		return this;
	}
}



module.exports = ServerFormAPI;
