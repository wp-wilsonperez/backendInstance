
import mongoose from 'mongoose';

let DeductibleSchema = new mongoose.Schema({
	name: {type: String, require: true},
	idRamo: {type: String},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	idInsurance: {type: String},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	description: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

export default mongoose.model('Deductible', DeductibleSchema)
