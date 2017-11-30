
import mongoose from 'mongoose';

let PolicySchema = new mongoose.Schema({
	policyNumber: {type: String},
	annexedNumber: {type: String},
	certificateNumber: {type: String},
	idInsurance: {type: String},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	idRamo: {type: String},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	idUser: {type: String},
	user: { type: mongoose.Schema.ObjectId, ref: "User"},
	idClient: {type: String},
	client: { type: mongoose.Schema.ObjectId, ref: "Client"},
	idBusiness: {type: String},
	business: { type: mongoose.Schema.ObjectId, ref: "Business"},
	idPaymentType: {type: String},
	porcentajeRamo: {type: Number},
	guarantor: {type: String},
	idDeductible: {type: String},
	deductible: { type: mongoose.Schema.ObjectId, ref: "Deductible"},
	insured: {type: String},
	startDate: {type: String},
	finishDate: {type: String},
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
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Policy', PolicySchema)
