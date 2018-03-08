
import mongoose from 'mongoose';

let NoRenewalRamoSchema = new mongoose.Schema({
	name: {type: String, require: true},
	idNoRenewal: {type: String, require: true},
	noRenewal: { type: mongoose.Schema.ObjectId, ref: "NoRenewal"},
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('NoRenewalRamo', NoRenewalRamoSchema)
