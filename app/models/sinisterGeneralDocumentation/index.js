
import mongoose from 'mongoose';

let SinisterGeneralDocumentationSchema = new mongoose.Schema({
	idSinisterGeneral: {type: String},
	sinisterGeneral: { type: mongoose.Schema.ObjectId, ref: "SinisterGeneral"},
	idSinisterDocumentationRamo: {type: String},
	sinisterDocumentationRamo: { type: mongoose.Schema.ObjectId, ref: "sinisterDocumentationRamo"},
	quantity: {type: Number},
	description: { type: String},
	sendDate: {type: Date},
	responsibleReception: {type: String},
	receptionDate: {type: Date},
	numberAllBilling: {type: Number},
	totalBillingValue: {type: Number},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('SinisterGeneralDocumentation', SinisterGeneralDocumentationSchema)
