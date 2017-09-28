
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const connection = mongoose.connect('mongodb://localhost/instance1');
autoIncrement.initialize(connection);

let WalletPaymentSchema = new mongoose.Schema({
	idWallet: {type: String, require: true},
	wallet: { type: mongoose.Schema.ObjectId, ref: "Wallet"},
	idBank: {type: String, require: true},
	bank: { type: mongoose.Schema.ObjectId, ref: "Bank"},
	compPayment: {type: Number},
	moneyType: {type: String},
	document: {type: String},
	details: {type: String},
	ctaCteNumber: {type: String},
	expirationDate: {type: Date},
	paymentValue: {type: Number},
	balance: {type: Number},
	paymentDate: {type: Date},
	moneyObservation: {type: String},
	percentagePrima: {type: Number},
	percentageIVA: {type: Number},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

WalletPaymentSchema.plugin(autoIncrement.plugin, { model: 'WalletPayment', field: 'compPayment', startAt: 1});

export default mongoose.model('WalletPayment', WalletPaymentSchema)
