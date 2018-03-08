
import mongoose from 'mongoose';

let TokenSchema = new mongoose.Schema({
	token: {type: String, require: true},
	idUser: {type: String, require: true},
	idRole: {type: String, require: true},
	idBranch: {type: String, require: true},
	created: {type: Date, require: true},
	expiration: {type: Date, require: true},
	dateDelete: {type: Date}
});

export default mongoose.model('Token', TokenSchema)
