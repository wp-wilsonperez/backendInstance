
import mongoose from 'mongoose';

let PolicyMedicalBusinessSchema = new mongoose.Schema({
	policyNumber: {type: String, require: true},
	idInsurance: {type: String, require: true},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	porcentajeRamo: {type: Number, require: true},
	idUser: {type: String, require: true},
	user: { type: mongoose.Schema.ObjectId, ref: "User"},
	idBusiness: {type: String, require: true},
	business: { type: mongoose.Schema.ObjectId, ref: "Business"},
	idDeductible: {type: String, require: true},
	deductible: { type: mongoose.Schema.ObjectId, ref: "Deductible"},
	deductibleEdited: {type: String, require: true},
	insured: {type: String, require: true},
	startDate: {type: Date, require: true},
	finishDate: {type: Date, require: true},
	daysofValidity: {type: Number, require: true},
	idPolicyType: {type: String, require: true},
	policyType: { type: mongoose.Schema.ObjectId, ref: "PolicyType"},
	idFrequencyPayment: {type: String, require: true},
	frequencyPayment: { type: mongoose.Schema.ObjectId, ref: "FrequencyPayment"},
	idCity: {type: String, require: true},
	city: { type: mongoose.Schema.ObjectId, ref: "City"},
	dateAdmission: {type: Date, require: true},
	dateCancellation: {type: Date, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('PolicyMedicalBusiness', PolicyMedicalBusinessSchema)
