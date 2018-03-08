
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let BranchSchema = new mongoose.Schema({
	name: {type: String, require: true, unique : true},
	address: {type: String, require: true},
	idCity: {type: String, require: true},
	city: { type: mongoose.Schema.ObjectId, ref: "City"},
	phone: {type: String, require: true},
	movil: {type: String, require: true},
	schedule: [{
		date_start: {type: Number, require: true},
		date_end: {type: Number, require: true},
		hours: {
			start: {type: String, require: true},
			end: {type: String, require: true},
		}
	}],
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

BranchSchema.plugin(uniqueValidator);

export default mongoose.model('Branch', BranchSchema)
