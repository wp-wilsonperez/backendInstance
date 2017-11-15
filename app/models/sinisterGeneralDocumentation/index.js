
import mongoose from 'mongoose';

let SinisterGeneralDocumentationSchema = new mongoose.Schema({
	idSinisterGeneral: {type: String, require: true},
	sinisterGeneral: { type: mongoose.Schema.ObjectId, ref: "SinisterGeneral"},
	idSinisterDocumentationRamo: {type: String, require: true},
	sinisterDocumentationRamo: { type: mongoose.Schema.ObjectId, ref: "sinisterDocumentationRamo"},
	quantity: {type: Number},
	description: { type: String},
	sendDate: {type: Date},
	responsibleReception: {type: String},
	receptionDate: {type: Date},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('SinisterGeneralDocumentation', SinisterGeneralDocumentationSchema)
