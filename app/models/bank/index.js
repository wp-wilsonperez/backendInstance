
import mongoose from 'mongoose';

let BankSchema = new mongoose.Schema({
	name: {type: String, require: true},
	month: {type: Number},
	totalMonths: {type: Number},
	interest: {type: Number},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('Bank', BankSchema)
