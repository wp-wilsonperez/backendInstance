
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
	insurance: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	idDeductible: {type: String},
	deductible: { type: mongoose.Schema.ObjectId, ref: "Deductible"},
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
	initialPayment: {type: Number},
	equalPayments: {type: Number},
	totalAmount: {type: Number},
	paymentType: {type: Number},
	idBank: {type: String},
	bank: { type: mongoose.Schema.ObjectId, ref: "Bank"},
	idTypeClient: {type: String},
	typeClient: { type: mongoose.Schema.ObjectId, ref: "typeClient"},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Quote', QuoteSchema)
