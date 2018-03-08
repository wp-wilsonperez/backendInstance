
import mongoose from 'mongoose';

let HelpLinkSchema = new mongoose.Schema({
	name: {type: String, require: true},
	link: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('HelpLink', HelpLinkSchema)
