
import mongoose from 'mongoose';

let BankInsuranceSchema = new mongoose.Schema({
	name: {type: String, require: true},
	idBank: {type: String, require: true},
	bank: { type: mongoose.Schema.ObjectId, ref: "Bank"},
	idInsurance: {type: String, require: true},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	monthWithoutInterest: {type: Number, require: true},
	interest: {type: Number, require: true},
	monthWithInterest: {type: Number, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('BankInsurance', BankInsuranceSchema)
