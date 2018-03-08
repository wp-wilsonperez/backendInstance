
import mongoose from 'mongoose';

let IssueSchema = new mongoose.Schema({
	name: {type: String, require: true},
	start: {type: Number, require: true},
	finish: {type: Number, require: true},
	value: {type: Number, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('Issue', IssueSchema)
