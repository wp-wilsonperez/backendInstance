
import mongoose from 'mongoose';

let SubItemAnnexSchema = new mongoose.Schema({
	idItemAnnex: {type: String, require: true},
	itemAnnex: { type: mongoose.Schema.ObjectId, ref: "ItemAnnex"},
	numberSubItem: {type: Number},
	name: {type: String},
	planAlternative: {type: String},
	ValueSubItem: {type: Number},
	tasa: {type: Number},
	calcFloat: {type: Number},
	primaNeta: {type: Number},
	detailsSubItem: {type: String},
	observationsSubItem: {type: String},
	exclusionDate: {type: Date},
	inclusionDate: {type: Date},
	modificationDate: {type: Date},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

export default mongoose.model('SubItemAnnex', SubItemAnnexSchema)
