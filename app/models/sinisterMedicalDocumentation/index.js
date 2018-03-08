
import mongoose from 'mongoose';

let SinisterMedicalDocumentationSchema = new mongoose.Schema({
	idSinisterMedical: {type: String, require: true},
	sinisterMedical: { type: mongoose.Schema.ObjectId, ref: "SinisterMedical"},
	idSinisterDocumentationRamo: {type: String, require: true},
	sinisterDocumentationRamo: { type: mongoose.Schema.ObjectId, ref: "SinisterDocumentationRamo"},
	quantity: {type: Number, require: true},
	description: {type: String, require: true},
	numberAllBilling: {type: Number, require: true},
	totalBillingValue: {type: Number, require: true},
	sendDate: {type: Date, require: true},
	responsibleReception: {type: Number, require: true},
	receptionDate: {type: Date, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('SinisterMedicalDocumentation', SinisterMedicalDocumentationSchema)
