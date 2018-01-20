
import mongoose from 'mongoose';

let SinisterSchema = new mongoose.Schema({
	idPolicy: {type: String, require: true},
	policy: { type: mongoose.Schema.ObjectId, ref: "Policy"},
	policyData: {type: Object},
	idPolicyAnnex: {type: String, require: true},
	annexData: {type: Object},
	idClient: {type: String, require: true},
	clientData: {type: Object},
	idRecipient: {type: String}, //CLIENT, BUSINESS, INSURANCE, USER
	recipient: {type: Object},
	typeRecipient: {type: String},
	compName: {type: String, require: true},
	clientInsured: {type: String, require: true},
	beneficiary: {type: String},
	dateSinister: {type: String},
	dateNotification: {type: String},
	trackingDate: {type: Date},
	beneficiary: {type: String},
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	sinisterState: {type: String},
	settlementDate: {type: Date},
	approvalDate: {type: Date},
	checkApproved: {type: Boolean},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	branchCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Sinister', SinisterSchema)
