
import mongoose from 'mongoose';

let PolicySchema = new mongoose.Schema({
	policyNumber: {type: String, require: true},
	annexedNumber: {type: String, require: true},
	certificateNumber: {type: String, require: true},
	idInsurance: {type: String, require: true},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	porcentajeRamo: {type: Number, require: true},
	idUser: {type: String, require: true},
	user: { type: mongoose.Schema.ObjectId, ref: "User"},
	idClient: {type: String, require: true},
	idPaymentType: {type: String, require: true},
	client: { type: mongoose.Schema.ObjectId, ref: "Client"},
	idDeductible: {type: String, require: true},
	guarantor: {type: String},
	deductible: { type: mongoose.Schema.ObjectId, ref: "Deductible"},
	insured: {type: String, require: true},
	startDate: {type: String, require: true},
	finishDate: {type: String, require: true},
	daysofValidity: {type: Number, require: true},
	idPolicyType: {type: String, require: true},
	policyType: { type: mongoose.Schema.ObjectId, ref: "PolicyType"},
	idFrequencyPayment: {type: String, require: true},
	frequencyPayment: { type: mongoose.Schema.ObjectId, ref: "FrequencyPayment"},
	idCity: {type: String, require: true},
	city: { type: mongoose.Schema.ObjectId, ref: "City"},
	dateAdmission: {type: String, require: true},
	dateCancellation: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	branchCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Policy', PolicySchema)
