
import mongoose from 'mongoose';

let PlanAlternativeSchema = new mongoose.Schema({
	name:{type: String,require:true},
	idPlanAssociation: {type: String, require: true},
	planAssociation: { type: mongoose.Schema.ObjectId, ref: "PlanAssociation"},
	idAlternative: {type: String, require: true},
	alternative: { type: mongoose.Schema.ObjectId, ref: "Alternative"},
	value: {type: Number, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('PlanAlternative', PlanAlternativeSchema)
