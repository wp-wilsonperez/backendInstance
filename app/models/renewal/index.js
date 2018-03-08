
import mongoose from 'mongoose';

let RenewalSchema = new mongoose.Schema({
	idPolicy: {type: String, require: true},
	policy: { type: Object, ref: "Policy"},
	numberPolicyOverdue: {type: Number},
	numberRenewedPolicy: {type: Number},
	dateNewTerm: {type: Date},
	sellerComments: {type: String},
	typePolicy: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('Renewal', RenewalSchema)
