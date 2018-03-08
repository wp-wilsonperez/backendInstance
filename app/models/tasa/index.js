
import mongoose from 'mongoose';

let TasaSchema = new mongoose.Schema({
	name: {type: String, require: true},
	idInsurance: {type: String},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	idDeductible: {type: String},
	deductible: { type: mongoose.Schema.ObjectId, ref: "Deductible"},
	idRamo: {type: String},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	carUse: {type: String},
	value: {type: Number},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('Tasa', TasaSchema)
