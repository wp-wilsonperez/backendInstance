
import mongoose from 'mongoose';

let AnnexMedicalBusinessItemSchema = new mongoose.Schema({
	idAnnexMedicalBusiness: {type: String, require: true},
	annexMedicalBusiness: { type: mongoose.Schema.ObjectId, ref: "AnnexMedicalBusiness"},
	idPlanAlternative: {type: String, require: true},
	planAlternative: { type: mongoose.Schema.ObjectId, ref: "PlanAlternative"},
	value: {type: Number, require: true},
	idClient: {type: String, require: true},
	client: { type: mongoose.Schema.ObjectId, ref: "Client"},
	alternative: {type: Object, require: true},
	annexDate: {type: Date, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('AnnexMedicalBusinessItem', AnnexMedicalBusinessItemSchema)
