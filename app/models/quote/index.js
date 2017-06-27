
import mongoose from 'mongoose';

let QuoteSchema = new mongoose.Schema({
	date: {type: Date},
	doc: {type: String},
	docType: {type: Boolean},
	name: {type: String},
	lastName: {type: String},
	cellPhone: {type: String},
	mail: {type: String},
	car: {type: String},
	carUse: {type: String},
	idInsurance: {type: String},
	idDeductible: {type: String},
	startDate: {type: Date},
	finishDate: {type: Date},
	valueCar: {type: Number},
	accessories: {type: String},
	tasaValue: {type: Number},
	iva: {type: Number},
	superBank: {type: String},
	peasantInsurance: {type: String},
	valueWithoutTaxes: {type: String},
	emissionRights: {type: String},
	totalAmount: {type: Number},
	idPaymentTye: {type: String},
	idTypeClient: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Quote', QuoteSchema)
