
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Config from './../../configs/app';

const connection = mongoose.connect(Config.mongoose);
autoIncrement.initialize(connection);

let WalletPaymentSchema = new mongoose.Schema({
	idWallet: {type: String, require: true},
	wallet: { type: mongoose.Schema.ObjectId, ref: "Wallet"},
	compPayment: {type: Number},
	ctaCteNumber: {type: String},
	expirationDate: {type: Date},
	paymentValue: {type: Number},
	arrayWalletPayment: [ {
			moneyType: {type: String},
			document: {type: String},
			idBank: {type: String, require: true},
			bank: { type: mongoose.Schema.ObjectId, ref: "Bank"},
			details: {type: String},
			percentagePrima: {type: Number},
			percentageIVA: {type: Number},
			balance: {type: Number},
			paymentDate: {type: Date},
			moneyObservation: {type: String}
		}
	],
	paymentFlag: {type: Boolean},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

WalletPaymentSchema.plugin(autoIncrement.plugin, { model: 'WalletPayment', field: 'compPayment', startAt: 1});

export default mongoose.model('WalletPayment', WalletPaymentSchema)
