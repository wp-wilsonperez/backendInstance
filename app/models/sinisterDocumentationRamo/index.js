
import mongoose from 'mongoose';

let SinisterDocumentationRamoSchema = new mongoose.Schema({
	idSinisterDocumentation: {type: String, require: true},
	sinisterDocumentation: { type: mongoose.Schema.ObjectId, ref: "SinisterDocumentation"},
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "ramo"},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('SinisterDocumentationRamo', SinisterDocumentationRamoSchema)
