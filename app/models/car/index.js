
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let CarSchema = new mongoose.Schema({
	idClient: {type: String, require: true},
	client: { type: mongoose.Schema.ObjectId, ref: "Client"},
	idRamo: {type: String, require: true},
	ramo: { type: mongoose.Schema.ObjectId, ref: "Ramo"},
	idCarBrand: {type: String, require: true},
	carBrand: { type: mongoose.Schema.ObjectId, ref: "CarBrand"},
	idCarModel: {type: String, require: true},
	carModel: { type: mongoose.Schema.ObjectId, ref: "CarModel"},
	idCarColor: {type: String, require: true},
	carColor: { type: mongoose.Schema.ObjectId, ref: "CarColor"},
	chasis: {type: String, require: true, unique : true},
	motor: {type: String, require: true, unique : true},
	placa: {type: String, require: true, unique : true},
	carUse: {type: String},
	extras: {type: String},
	extrasValue: {type: Number},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

CarSchema.plugin(uniqueValidator);

export default mongoose.model('Car', CarSchema)
