
import mongoose from 'mongoose';

let ClientSchema = new mongoose.Schema({
	name: {type: String, require: true},
	lastName: {type: String, require: true},
	doc: {type: String},
	docType: {type: String},
	phones: {type: String},
	checkPhones: {type: Boolean},
	detailPhones: {type: String},
	cellPhone: {type: String},
	checkCellPhone: {type: Boolean},
	detailCellPhone: {type: String},
	mail: {type: String},
	checkMail: {type: Boolean},
	detailMail: {type: String},
	address: {type: String},
	nameEmergency: {type: String},
	lastNameEmergency: {type: String},
	phoneEmergency: {type: String},
	nameWork: {type: String},
	phoneWork: {type: String},
	addressWork: {type: String},
	map: {
		longitude: {type: String},
		latitude: {type: String}
	},
	mapSecond: {
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
	typeClient: { type: mongoose.Schema.ObjectId, ref: "TypeClient"},
	idCity: {type: String},
	city: { type: mongoose.Schema.ObjectId, ref: "City"},
	idMaritalStatus: {type: String},
	maritalStatus: { type: mongoose.Schema.ObjectId, ref: "MaritalStatus"},
	user: {type: String},
	password: {type: String},
	confirm: {type: Boolean},
	codRecipient :{type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('Client', ClientSchema)
