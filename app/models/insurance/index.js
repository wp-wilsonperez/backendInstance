
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let InsuranceSchema = new mongoose.Schema({
	ruc: {type: String, require: true, unique : true},
	bussinesName: {type: String},
	cellPhone: {type: String},
	phones: {type: String},
	address: {type: String},
	logo: {type: String},
	img1: {type: String},
	img2: {type: String},
	img3: {type: String},
	parking: {type: Boolean},
	schedules: {type: String},
	web: {type: String},
	mail: {type: String},
	Enable: {type: Boolean},
	codRecipient :{type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

InsuranceSchema.plugin(uniqueValidator);

export default mongoose.model('Insurance', InsuranceSchema)
