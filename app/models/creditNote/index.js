
import mongoose from 'mongoose';

let CreditNoteSchema = new mongoose.Schema({
	numberCreditNote: {type: Number, require: true},
	idBilling: {type: String, require: true},
	dataBilling: { type: Object},
	idPolicy: {type: String, require: true},
	policy: { type: mongoose.Schema.ObjectId, ref: "Policy"},
	idPolicyAnnex: {type: String, require: true},
	policyAnnex: { type: mongoose.Schema.ObjectId, ref: "PolicyAnnex"},
	totalPrima: {type: Number, require: true},
	expirationDate: {type: Date, require: true},
	cancellationDate: {type: Date, require: true},
	days: {type: Number, require: true},
	superBank: {type: String, require: true},
	superCamp: {type: String, require: true},
	valueIssue: {type: Number, require: true},
	others1: {type: String, require: true},
	others2: {type: String, require: true},
	iva: {type: Number, require: true},
	others3: {type: String, require: true},
	others4: {type: String, require: true},
	creditNoteValueBefore: {type: Number, require: true},
	creditNoteValueAfter: {type: Number},
	observation: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	branchCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('CreditNote', CreditNoteSchema)
