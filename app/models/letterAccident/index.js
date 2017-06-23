
import mongoose from 'mongoose';

let LetterAccindentSchema = new mongoose.Schema({
	idInsurance: {type: String, require: true},
	idRamo: {type: String, require: true},
	file: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('LetterAccindent', LetterAccindentSchema)
