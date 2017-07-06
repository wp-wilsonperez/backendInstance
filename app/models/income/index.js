
import mongoose from 'mongoose';

let IncomeSchema = new mongoose.Schema({
	typeReception: {type: String, require: true},
	IdClientSend: {type: String, require: true},
	clientSend: { type: mongoose.Schema.ObjectId, ref: "Client"},
	idBusinessSend: {type: String, require: true},
	businessSend: { type: mongoose.Schema.ObjectId, ref: "Business"},
	idInsuranceSend: {type: String, require: true},
	insuranceSend: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	IdUserAddress: {type: String, require: true},
	userAddress: { type: mongoose.Schema.ObjectId, ref: "User"},
	dateIncome: {type: String, require: true},
	dateReception: {type: String, require: true},
	details: {type: String, require: true},
	observations: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Income', IncomeSchema)
