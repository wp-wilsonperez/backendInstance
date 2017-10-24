
import mongoose from 'mongoose';

let SinisterSchema = new mongoose.Schema({
	idPolicy: {type: String, require: true},
	policyData: {type: Object},
	idPolicyAnnex: {type: String, require: true},
	annexData: {type: Object},
	idClient: {type: String, require: true},
	clientData: {type: Object},
	compName: {type: String, require: true},
	clientInsured: {type: String, require: true},
	beneficiary: {type: String},
	dateSinister: {type: String},
	dateNotification: {type: String},
	beneficiary: {type: String},
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	sinisterState: {type: String},
	settlementDate: {type: Date},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Sinister', SinisterSchema)
