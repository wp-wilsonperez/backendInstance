
import mongoose from 'mongoose';

let PolicyAnnexSchema = new mongoose.Schema({
	name: {type: String, require: true},
	idPolicy: {type: String, require: true},
	policy: { type: mongoose.Schema.ObjectId, ref: "Policy"},
	annexNumber: {type: Number, require: true},
	certificateNumber: {type: Number, require: true},
	totalPrima: {type: Number, require: true},
	detailsAnnex: {type: String, require: true},
	superBank: {type: String, require: true},
	iva: {type: Number, require: true},
	segCamp: {type: String, require: true},
	valueIssue: {type: String, require: true},
	totalValue: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('PolicyAnnex', PolicyAnnexSchema)
