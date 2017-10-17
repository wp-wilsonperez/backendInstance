
import mongoose from 'mongoose';

let ExpirationDateSchema = new mongoose.Schema({
	idPolicy: {type: String, require: true},
	policy: { type: mongoose.Schema.ObjectId, ref: "Policy"},
	numberPolicyOverdue: {type: Number},
	numberRenewedPolicy: {type: Number},
	dateNewTerm: {type: Date},
	sellerComments: {type: String},
	typePolicy: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('ExpirationDate', ExpirationDateSchema)
