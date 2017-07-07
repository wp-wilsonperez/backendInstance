
import mongoose from 'mongoose';

let RouteSchema = new mongoose.Schema({
	typeReception: {type: String, require: true},
	idUserSend: {type: String},
	userSend: { type: mongoose.Schema.ObjectId, ref: "User"},
	idClientRecipient: {type: String},
	clientRecipient: { type: mongoose.Schema.ObjectId, ref: "Client"},
	idBusinessRecipent: {type: String},
	businessRecipent: { type: mongoose.Schema.ObjectId, ref: "Business"},
	idInsuranceRecipent: {type: String},
	insuranceRecipent: { type: mongoose.Schema.ObjectId, ref: "Insurance"},
	dateRoute: {type: Date},
	dateReception: {type: Date},
	dateMessenger: {type: Date},
	dateReEntry: {type: Date},
	dateReturn: {type: Date},
	details: {type: String},
	observations: {type: String},
	dateCreate: {type: Date},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Route', RouteSchema)
