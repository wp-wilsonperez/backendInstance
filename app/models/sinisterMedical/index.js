
import mongoose from 'mongoose';

let SinisterMedicalSchema = new mongoose.Schema({
	idSinister: {type: String, require: true},
	sinister: { type: mongoose.Schema.ObjectId, ref: "Sinister"},
	idClient: {type: String, require: true},
	client: { type: mongoose.Schema.ObjectId, ref: "Client"},
	dataPatient: {type: Object, require: true},
	sinisterDiagnosis: {type: String, require: true},
	sinisterValue: {type: Number, require: true},
	notCovered: {type: Boolean, require: true},
	observationNotCovered: {type: String, require: true},
	observationLiquidation: {type: String, require: true},
	liquidationValue: {type: Number, require: true},
	liquidationDate: {type: Date, require: true},
	deliverDate: {type: Date, require: true},
	lastDocumentSent: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('SinisterMedical', SinisterMedicalSchema)
