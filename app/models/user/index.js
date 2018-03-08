
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let UserSchema = new mongoose.Schema({
	name: {type: String, require: true},
	lastName: {type: String, require: true},
	cedula: {type: String, require: true, unique : true},
	password: {type: String, require: true},
	mail: {type: String, require: true, unique : true},
	phone: {type: String, require: true},
	dateBirthday: {type: String, require: true},
	idRole: {type: String, require: true},
	role: { type: mongoose.Schema.ObjectId, ref: "Role"},
	idBranch: {type: String, require: true},
	branch: { type: mongoose.Schema.ObjectId, ref: "Branch"},
	userImg: {type: String, default: ""},
	Enabled: {type: Number, require: true},
	codRecipient :{type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

UserSchema.plugin(uniqueValidator);

export default mongoose.model('User', UserSchema)
