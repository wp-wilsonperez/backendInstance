
import mongoose from 'mongoose';

let LetterAccindentSchema = new mongoose.Schema({
	idInsurance: {type: String, require: true},
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	file: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('LetterAccindent', LetterAccindentSchema)
