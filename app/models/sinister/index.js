
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import Config from './../../configs/app';

const connection = mongoose.connect(Config.mongoose);
autoIncrement.initialize(connection);

let SinisterSchema = new mongoose.Schema({
	sinisterNumber: {type:  Number},
	idPolicy: {type: String},
	policy: { type: mongoose.Schema.ObjectId, ref: "Policy"},
	policyData: {type: Object},
	idPolicyAnnex: {type: String},
	annexData: {type: Object},
	idClient: {type: String},
	clientData: {type: Object},
	idRecipient: {type: String}, //CLIENT, BUSINESS, INSURANCE, USER
	recipient: {type: Object},
	typeRecipient: {type: String},
	compName: {type: String},
	clientInsured: {type: String},
	beneficiary: {type: String},
	dateSinister: {type: String},
	dateNotification: {type: String},
	trackingDate: {type: Date},
	beneficiary: {type: String},
	idRamo: {type: String},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	sinisterState: {type: String},
	settlementDate: {type: Date},
	approvalDate: {type: Date},
	checkApproved: {type: Boolean},
	valorAsegurado: {type: Number},
	item: {
		idSinister: {type: String},
		sinister: { type: mongoose.Schema.ObjectId, ref: "Sinister"},
		workshop: {type: String},
		arrangement: { type: String},
		rasa: {type: String},
		sinisterValue: {type: Number},
		rc: {type: String},
		deductibleValue: {type: Number},
		depreciation: {type: String},
		others1: {type: String},
		others2: {type: String},
		others3: {type: String},
		notCovered: {type: String},
		liquidation: {type: Number},
		idCar: {type: String},
		carDetails: { type: Object},
		sinisterMap: {
			longitude: {type: String},
			latitude: {type: String}
		},
		idClient: {type: Object},
		client: { type: mongoose.Schema.ObjectId, ref: "Client"},
		dataPatient: {type: Object},
		sinisterDiagnosis: {type: String},
		observationNotCovered: {type: String},
		observationLiquidation: {type: String},
		liquidationValue: {type: Number},
		liquidationDate: {type: Date},
		deliverDate: {type: Date},
		lastDocumentSent: {type: String},
		items: [{
			idSinisterGeneral: {type: String},
			sinisterGeneral: { type: mongoose.Schema.ObjectId, ref: "SinisterGeneral"},
			idSinisterDocumentationRamo: {type: String},
			sinisterDocumentationRamo: { type: mongoose.Schema.ObjectId, ref: "sinisterDocumentationRamo"},
			quantity: {type: Number},
			description: { type: String},
			sendDate: {type: Date},
			responsibleReception: {type: String},
			receptionDate: {type: Date},
			numberAllBilling: {type: Number},
			totalBillingValue: {type: Number}
		}]
	},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	branchCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

SinisterSchema.plugin(autoIncrement.plugin, { model: 'Sinister', field: 'sinisterNumber', startAt: 1});

export default mongoose.model('Sinister', SinisterSchema)
