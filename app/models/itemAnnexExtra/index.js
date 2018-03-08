
import mongoose from 'mongoose';

let ItemAnnexExtraSchema = new mongoose.Schema({
	idItemAnnexCar: {type: String, require: true},
	itemAnnexCar: { type: mongoose.Schema.ObjectId, ref: "ItemAnnexCar"},
	extraDetails: {type: String, require: true},
	extraValue: {type: Number, require: true},
	extraTasa: {type: Number, require: true},
	exclusionDate: {type: Date, require: true},
	inclusionDate: {type: Date, require: true},
	modificationDate: {type: Date, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('ItemAnnexExtra', ItemAnnexExtraSchema)
