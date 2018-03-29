
import mongoose from 'mongoose';

let DeprecationSchema = new mongoose.Schema({
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	idBranch: {type: String, require: true},
	branch: { type: mongoose.Schema.ObjectId, ref: "Branch"},
	year: {type: Number},
	value: {type: Number},
	typeYear: { type: String, enum:['first_year','last_year'] },
	activated: {type: Boolean},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

export default mongoose.model('Deprecation', DeprecationSchema)
