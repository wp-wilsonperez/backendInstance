
import mongoose from 'mongoose';

let BusinessSchema = new mongoose.Schema({
	ruc: {type: String, require: true},
	name: {type: String, require: true},
	address: {type: String, require: true},
	phones: {type: String, require: true},
	cellPhone: {type: String, require: true},
	map: {type: String, require: true},
	mail: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Business', BusinessSchema)