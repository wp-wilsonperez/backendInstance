
import mongoose from 'mongoose';

let BankSchema = new mongoose.Schema({
	name: {type: String, require: true},
	month: {type: Number, require: true},
	interest: {type: Number, require: true},
	totalMonths: {type: String, require: true},
	idInsurance: {type: String},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Bank', BankSchema)
