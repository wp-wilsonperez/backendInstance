
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const connection = mongoose.connect('mongodb://localhost/instance1');
autoIncrement.initialize(connection);

let WalletSchema = new mongoose.Schema({
	idPolicy: {type: String, require: true},
	policy: { type: mongoose.Schema.ObjectId, ref: "Policy"},
	idPolicyAnnex: {type: String, require: true},
	policyAnnex: { type: mongoose.Schema.ObjectId, ref: "PolicyAnnex"},
	idBilling: {type: String, require: true},
	billing: { type: mongoose.Schema.ObjectId, ref: "Billing"},
	DetailsBillingData: {type: String},
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
