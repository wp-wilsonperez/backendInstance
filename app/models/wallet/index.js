
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const connection = mongoose.connect('mongodb://localhost/instance1');
autoIncrement.initialize(connection);

let WalletSchema = new mongoose.Schema({
	idBilling: {type: String, require: true},
	DetailsBillingData: {type: Object},
	compNumber: {type: Number},
	expirationDate: {type: Date},
	paymentValue: {type: Number},
	detailsWallet: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});

WalletSchema.plugin(autoIncrement.plugin, { model: 'Wallet', field: 'compNumber', startAt: 1});

export default mongoose.model('Wallet', WalletSchema)
