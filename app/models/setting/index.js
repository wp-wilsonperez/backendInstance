
import mongoose from 'mongoose';

let SettingSchema = new mongoose.Schema({
	iva: {type: Number, require: true},
	connectionTime: {type: Number},
	maxAttached: {type: Number},
	idSchedule: {type: String},
	idMacs: [ {
			name: {type: String},
			mac: {type: String}
		}
	],
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

export default mongoose.model('Setting', SettingSchema)
