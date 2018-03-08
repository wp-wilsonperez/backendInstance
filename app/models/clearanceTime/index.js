
import mongoose from 'mongoose';

let ClearanceTimeSchema = new mongoose.Schema({
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	idInsurance: {type: String, require: true},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	idBranch: {type: String, require: true},
	branch: { type: mongoose.Schema.ObjectId, ref: "Branch"},
	time: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('ClearanceTime', ClearanceTimeSchema)
