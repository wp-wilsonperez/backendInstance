
import mongoose from 'mongoose';

let TasaSchema = new mongoose.Schema({
	name: {type: String, require: true},
	idInsurance: {type: String},
	idDeductible: {type: String},
	idRamo: {type: String},
	carUse: {type: String},
	value: {type: Number},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Tasa', TasaSchema)
