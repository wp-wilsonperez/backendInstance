
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let RoleSchema = new mongoose.Schema({
	name: {type: String, require: true, unique : true},
	description: {type: String},
	grant: {type: String, default: ''},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

RoleSchema.plugin(uniqueValidator);

export default mongoose.model('Role', RoleSchema)
