
import mongoose from 'mongoose';

let DeductibleSchema = new mongoose.Schema({
	name: {type: String, require: true},
	idBranch: {type: String},
	idInsurance: {type: String},
	description: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

export default mongoose.model('Deductible', DeductibleSchema)
