
import mongoose from 'mongoose';

let ItemAnnexCarSchema = new mongoose.Schema({
	idPolicyAnnex: {type: String, require: true},
	policyAnnex: { type: mongoose.Schema.ObjectId, ref: "PolicyAnnex"},
	idCar: {type: String, require: true},
	car: { type: mongoose.Schema.ObjectId, ref: "Car"},
	tasa: {type: Number, require: true},
	carUse: {type: String, require: true},
	interest: {type: Number, require: true},
	carValue: {type: Number, require: true},
	amparoPatrimonial: {type: Number, require: true},
	rc: {type: String, require: true},
	others: {type: String, require: true},
	othersPrima: {type: Number, require: true},
	detailsCar: {type: String, require: true},
	prima: {type: Number, require: true},
	exclusionDate: {type: Date, require: true},
	inclusionDate: {type: Date, require: true},
	modificationDate: {type: Date, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('ItemAnnexCar', ItemAnnexCarSchema)
