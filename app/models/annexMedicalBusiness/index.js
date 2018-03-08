
import mongoose from 'mongoose';

let AnnexMedicalBusinessSchema = new mongoose.Schema({
	idPolicyMedicalBusiness: {type: String, require: true},
	policyMedicalBusiness: { type: mongoose.Schema.ObjectId, ref: "PolicyMedicalBusiness"},
	idPlanAssociation: {type: String, require: true},
	planAssociation: { type: mongoose.Schema.ObjectId, ref: "PlanAssociation"},
	annexNumber: {type: Number, require: true},
	certificateNumber: {type: Number, require: true},
	valueIssue: {type: Number, require: true},
	iva: {type: Number, require: true},
	others1: {type: String, require: true},
	others2: {type: String, require: true},
	others3: {type: String, require: true},
	observation: {type: String, require: true},
	tasa: {type: Number, require: true},
	totalPrima: {type: Number, require: true},
	TotalValue: {type: Number, require: true},
	alertInclucion: {type: String, require: true},
	hasBilling: {type: Boolean, require: true},
	isBilling: {type: Boolean, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('AnnexMedicalBusiness', AnnexMedicalBusinessSchema)
