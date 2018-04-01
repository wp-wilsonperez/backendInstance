
import mongoose from 'mongoose';

let PolicySchema = new mongoose.Schema({
	policyNumber: {type: String},
	annexedNumber: {type: String},
	certificateNumber: {type: String},
	idInsurance: {type: String},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	idRamo: {type: String},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	typeRecipient: {type: String},
	idRecipient: {type: String}, //CLIENT, BUSINESS, INSURANCE, USER
	recipient: {type: Object},
	idPaymentType: {type: String},
	porcentajeRamo: {type: Number},
	guarantor: {type: String},
	idDeductible: {type: String},
	deductible: { type: mongoose.Schema.ObjectId, ref: "Deductible"},
	futureYears: {type: Boolean},
	insured: {type: String},
	startDate: {type: Date},
	finishDate: {type: Date},
	daysofValidity: {type: Number},
	idPolicyType: {type: String},
	policyType: { type: mongoose.Schema.ObjectId, ref: "PolicyType"},
	idFrequencyPayment: {type: String},
	frequencyPayment: { type: mongoose.Schema.ObjectId, ref: "FrequencyPayment"},
	idCity: {type: String},
	city: { type: mongoose.Schema.ObjectId, ref: "City"},
	dateAdmission: {type: String},
	dateCancellation: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	branchCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	idPlan:{type: String},
	dateDelete: {type: Date}
});


export default mongoose.model('Policy', PolicySchema)
