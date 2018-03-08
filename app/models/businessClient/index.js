
import mongoose from 'mongoose';

let BusinessClientSchema = new mongoose.Schema({
	idBusiness: {type: String, require: true},
	business: { type: mongoose.Schema.ObjectId, ref: "Business"},
	idClient: {type: String, require: true},
	client: { type: mongoose.Schema.ObjectId, ref: "Client"},
	idAlternative: {type: String, require: true},
	alternative: { type: mongoose.Schema.ObjectId, ref: "Alternative"},
	initial: {type: Boolean},
	initialDate: {type: Date},
	inclusion: {type: Boolean},
	inclusionDate: {type: Date},
	exclusion: {type: Boolean},
	exclusionDate: {type: Date},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('BusinessClient', BusinessClientSchema)
