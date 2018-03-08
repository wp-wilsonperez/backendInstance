
import mongoose from 'mongoose';

let SinisterGeneralSchema = new mongoose.Schema({
	idSinister: {type: String},
	sinister: { type: mongoose.Schema.ObjectId, ref: "Sinister"},
	workshop: {type: String},
	arrangement: { type: String},
	rasa: {type: String},
	sinisterValue: {type: Number},
	rc: {type: String},
	deductibleValue: {type: Number},
	depreciation: {type: String},
	others1: {type: String},
	others2: {type: String},
	others3: {type: String},
	notCovered: {type: String},
	observationNotCovered: {type: String},
	liquidation: {type: Number},
	liquidationDate: {type: Date},
	deliverDate: {type: Date},
	idCar: {type: String},
	carDetails: { type: Object},
	sinisterDiagnosis: {type: String},
	sinisterMap: {
		longitude: {type: String},
		latitude: {type: String}
	},
	idClient: {type: String},
	client: { type: mongoose.Schema.ObjectId, ref: "Client"},
	dataPatient: {type: Object},
	sinisterDiagnosis: {type: String},
	observationNotCovered: {type: String},
	observationLiquidation: {type: String},
	liquidationValue: {type: Number},
	liquidationDate: {type: Date},
	deliverDate: {type: Date},
	lastDocumentSent: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('SinisterGeneral', SinisterGeneralSchema)
