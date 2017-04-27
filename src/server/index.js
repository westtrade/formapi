const FormAPI = require('../FormAPI');

class ServerFormAPI extends FormAPI {
	
	async parse(request) {

		return this;
	}
}



module.exports = ServerFormAPI;
