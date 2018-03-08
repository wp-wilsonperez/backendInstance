
import mongoose from 'mongoose';

let LogSchema = new mongoose.Schema({
	log: {type: String, require: true},
	user: {type: Object},
	dateLog: {type: Date, require: true},
	dateDelete: {type: Date}
});

export default mongoose.model('Log', LogSchema)
