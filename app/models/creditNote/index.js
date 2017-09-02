
import mongoose from 'mongoose';

let CreditNoteSchema = new mongoose.Schema({
	numberCreditNote: {type: Number, require: true},
	idBilling: {type: String, require: true},
	dataBilling: { type: Object},
	expirationDate: {type: Date, require: true},
	cancellationDate: {type: Date, require: true},
	days: {type: Number, require: true},
	insuredValue: {type: Number, require: true},
	extraValue: {type: Number},
	tasa: {type: Number, require: true},
	creditNoteValue: {type: Number, require: true},
	observation: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('CreditNote', CreditNoteSchema)
