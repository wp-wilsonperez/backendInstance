
import mongoose from 'mongoose';

let BillingPolicySchema = new mongoose.Schema({
	idBilling: {type: String, require: true},
	billing: { type: mongoose.Schema.ObjectId, ref: "Billing"},
	idRamo: {type: String, require: true},
	ramo: { type: Object},
	annexNumber: {type: Number, require: true},
	refNumber: {type: Number, require: true},
	prima: {type: Number, require: true},
	otherWithIVA1: {type: Number, require: true},
	superBank: {type: Number, require: true},
	segCamp: {type: Number, require: true},
	issue: {type: Number, require: true},
	IVA: {type: Number, require: true},
	others: {type: Number, require: true},
	totalValue: {type: Number, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('BillingPolicy', BillingPolicySchema)
