
import mongoose from 'mongoose';

let ItemAnnexSchema = new mongoose.Schema({
	idPolicyAnnex: {type: String, require: true},
	policyAnnex: { type: mongoose.Schema.ObjectId, ref: "PolicyAnnex"},
	numberItem: {type: Number, require: true},
	travelfrom: {type: String},
	travelTo: {type: String},
	travelTransportation: {type: String},
	commodity: {type: String},
	coverage: {type: String},
	packaging: {type: String},
	application: {type: String},
	order: {type: String},
	provider: {type: String},
	totalValueItem: {type: Number},
	totalValuePrimaItem: {type: Number},
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

export default mongoose.model('ItemAnnex', ItemAnnexSchema)
