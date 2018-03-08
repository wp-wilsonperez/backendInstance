
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let PolicyTypeSchema = new mongoose.Schema({
	name: {type: String, require: true, unique : true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

PolicyTypeSchema.plugin(uniqueValidator);

export default mongoose.model('PolicyType', PolicyTypeSchema)
