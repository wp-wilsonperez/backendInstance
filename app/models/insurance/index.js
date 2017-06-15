
import mongoose from 'mongoose';

let InsuranceSchema = new mongoose.Schema({
	name: {type: String, require: true},
	description: {type: String},
	Enable: {type: Boolean},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

export default mongoose.model('Insurance', InsuranceSchema)
