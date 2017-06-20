
import mongoose from 'mongoose';

let InsuranceSchema = new mongoose.Schema({
	ruc: {type: String, require: true},
	bussinesName: {type: String},
	cellPhone: {type: String},
	phones: {type: String},
	address: {type: String},
	img1: {type: String},
	img2: {type: String},
	img3: {type: String},
	parking: {type: Boolean},
	schedules: {type: String},
	web: {type: String},
	mail: {type: String},
	Enable: {type: Boolean},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

export default mongoose.model('Insurance', InsuranceSchema)
