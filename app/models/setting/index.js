
import mongoose from 'mongoose';

let SettingSchema = new mongoose.Schema({
	iva: {type: Number, require: true},
	connectionTime: {type: Number, require: true},
	maxAttached: {type: Number, default: ''},
	schedule: [ {
			date_start: {type: Number, require: true},
			date_end: {type: Number, require: true},
			hours: {
				start: {type: String, require: true},
				end: {type: String, require: true},
			}
		}
	],
	macsAllowed: [ {
			mac: {type: String}
		}
	],
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

export default mongoose.model('Setting', SettingSchema)
