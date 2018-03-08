
import mongoose from 'mongoose';

let SinisterDocumentationSchema = new mongoose.Schema({
	name: {type: String, require: true},
	description: {type: String},
	enabled: {type: Boolean, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('SinisterDocumentation', SinisterDocumentationSchema)
