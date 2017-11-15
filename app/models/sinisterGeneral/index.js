
import mongoose from 'mongoose';

let SinisterGeneralSchema = new mongoose.Schema({
	idSinister: {type: String, require: true},
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
	sinisterMap: {
		longitude: {type: String},
		latitude: {type: String}
	},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('SinisterGeneral', SinisterGeneralSchema)
