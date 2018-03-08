
import mongoose from 'mongoose';

let PlanAssociationSchema = new mongoose.Schema({
	name: {type: String, require: true},
	idPlan: {type: String, require: true},
	plan: { type: mongoose.Schema.ObjectId, ref: "Plan"},
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	idInsurance: {type: String, require: true},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('PlanAssociation', PlanAssociationSchema)
