
import mongoose from 'mongoose';

let TokenSchema = new mongoose.Schema({
	token: {type: String, require: true},
	idUser: {type: String, require: true},
	idRol: {type: String, require: true},
	created: {type: Date, require: true},
	expiration: {type: Date, require: true}
});

export default mongoose.model('Token', TokenSchema)
