
import mongoose from 'mongoose';

let ItemAnnexFireSchema = new mongoose.Schema({
	idPolicyAnnex: {type: String, require: true},
	policyAnnex: { type: mongoose.Schema.ObjectId, ref: "PolicyAnnex"},
	numberItem: {type: Number, require: true},
	totalValueItem: {type: Number, require: true},
	totalValuePrimaItem: {type: Number, require: true},
	detailsItem: {type: String},
	observationsItem: {type: String},
	validDays: {type: String},
	exclusionDate: {type: Date},
	inclusionDate: {type: Date},
	modificationDate: {type: Date},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

export default mongoose.model('ItemAnnexFire', ItemAnnexFireSchema)
