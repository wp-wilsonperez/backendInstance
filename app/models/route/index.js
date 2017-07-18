
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const connection = mongoose.connect('mongodb://localhost/instance1');
autoIncrement.initialize(connection);

let RouteSchema = new mongoose.Schema({
	routeNumber: {type:  Number},
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

RouteSchema.plugin(autoIncrement.plugin, { model: 'Route', field: 'routeNumber', startAt: 1});

export default mongoose.model('Route', RouteSchema)
