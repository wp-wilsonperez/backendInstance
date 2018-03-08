
import mongoose from 'mongoose';

let BillingSchema = new mongoose.Schema({
	typeBilling: {type: String, require: true},
	detailsClientBilling: { type: Object},
	idInsuraceCom: {type: String, require: true},
	nameInsuranceCom: {type: String, require: true},
	billingNumber: {type: Number, require: true},
	billingDate: {type: Date, require: true},
	firstPaymentDate: {type: Date, require: true},
	paymentType: {type: String, require: true},
	initialPayment: {type: Number, require: true},
	equalPayments: {type: Number, require: true},
	valueEqualPayments: {type: Number, require: true},
	observationsBilling: {type: String, require: true},
	totalPrimaValue: {type: Number, require: true},
	totalIVAValue: {type: Number, require: true},
	totalBillingValue: {type: Number, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	branchCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('Billing', BillingSchema)
