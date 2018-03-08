
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let BusinessSchema = new mongoose.Schema({
	ruc: {type: String, require: true, unique : true},
	name: {type: String, require: true},
	address: {type: String, require: true},
	phones: {type: String, require: true},
	cellPhone: {type: String, require: true},
	map: {type: String, require: true},
	mail: {type: String, require: true},
	codRecipient :{type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

BusinessSchema.plugin(uniqueValidator);

export default mongoose.model('Business', BusinessSchema)
