
import mongoose from 'mongoose';

let WalletPaymentBinnacleSchema = new mongoose.Schema({
	idWalletPayment: {type: String, require: true},
	walletPayment: { type: mongoose.Schema.ObjectId, ref: "WalletPayment"},
	detailsCall: {type: String},
	callDate: {type: Date},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('WalletPaymentBinnacle', WalletPaymentBinnacleSchema)
