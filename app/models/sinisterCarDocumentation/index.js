
import mongoose from 'mongoose';

let SinisterCarDocumentationSchema = new mongoose.Schema({
	idSinisterCar: {type: String, require: true},
	sinisterCar: { type: mongoose.Schema.ObjectId, ref: "SinisterCar"},
	idSinisterDocumentationRamo: {type: String, require: true},
	quantity: {type: Number, require: true},
	description: {type: String, require: true},
	sendDate: {type: Date, require: true},
	responsibleReception: {type: String, require: true},
	receptionDate: {type: Date, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('SinisterCarDocumentation', SinisterCarDocumentationSchema)
