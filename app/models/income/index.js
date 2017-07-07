
import mongoose from 'mongoose';

let IncomeSchema = new mongoose.Schema({
	typeReception: {type: String, require: true},
	IdClientSend: {type: String},
	clientSend: { type: mongoose.Schema.ObjectId, ref: "Client"},
	idBusinessSend: {type: String},
	businessSend: { type: mongoose.Schema.ObjectId, ref: "Business"},
	idInsuranceSend: {type: String},
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
