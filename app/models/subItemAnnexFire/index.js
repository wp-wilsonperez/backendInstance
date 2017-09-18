
import mongoose from 'mongoose';

let SubItemAnnexFireSchema = new mongoose.Schema({
	idItemAnnexFire: {type: String, require: true},
	itemAnnexFire: { type: mongoose.Schema.ObjectId, ref: "ItemAnnexFire"},
	numberSubItem: {type: Number},
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

export default mongoose.model('SubItemAnnexFire', SubItemAnnexFireSchema)
