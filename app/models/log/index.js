
import mongoose from 'mongoose';

let LogSchema = new mongoose.Schema({
	log: {type: String, require: true},
	user: {
		id: {type: String},
		cedula: {type: String},
		username: {type: String}
	},
	dateLog: {type: Date, require: true}
});

export default mongoose.model('Log', LogSchema)
