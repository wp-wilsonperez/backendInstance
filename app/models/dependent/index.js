
import mongoose from 'mongoose';

let DependentSchema = new mongoose.Schema({
	idClient: {type: String, require: true},
	client: { type: mongoose.Schema.ObjectId, ref: "Client"},
	cedula: {type: String, require: true},
	name: {type: String, require: true},
	lastName: {type: String, require: true},
	relationship: {type: String, require: true},
	birthdate: {type: String, require: true},
	workingDetails: {type: String, require: true},
	sex: {type: String, require: true},
	notCovered: {type: Boolean, require: true},
	docRelationship: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('Dependent', DependentSchema)
