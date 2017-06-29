
import mongoose from 'mongoose';

let ClientSchema = new mongoose.Schema({
	name: {type: String, require: true},
	lastName: {type: String, require: true},
	doc: {type: String},
	docType: {type: Boolean},
	cellPhone: {type: String},
	mail: {type: String},
	address: {type: String},
	nameEmergency: {type: String},
	lastNameEmergency: {type: String},
	phoneEmergency: {type: String},
	nameWork: {type: String},
	phoneWork: {type: String},
	map: {
		longitude: {type: String},
		latitude: {type: String}
	},
	birthdate: {type: String},
	copyDoc: {type: String},
	copyRegister: {type: String},
	copyVote: {type: String},
	copyBasicService: {type: String},
	copyGroup: {type: String},
	idTypeClient: {type: String},
	idCity: {type: String},
	idMaritalStatus: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Client', ClientSchema)
