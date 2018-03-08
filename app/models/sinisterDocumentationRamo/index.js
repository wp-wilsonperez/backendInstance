
import mongoose from 'mongoose';

let SinisterDocumentationRamoSchema = new mongoose.Schema({
	idSinisterDocumentation: {type: String, require: true},
	sinisterDocumentation: { type: mongoose.Schema.ObjectId, ref: "SinisterDocumentation"},
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('SinisterDocumentationRamo', SinisterDocumentationRamoSchema)
