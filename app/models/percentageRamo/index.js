
import mongoose from 'mongoose';

let PercentageRamoSchema = new mongoose.Schema({
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	idInsurance: {type: String, require: true},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	value: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('PercentageRamo', PercentageRamoSchema)
