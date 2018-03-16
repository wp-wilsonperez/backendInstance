
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Config from './../../configs/app';

const connection = mongoose.connect(Config.mongoose);
autoIncrement.initialize(connection);

let RouteSchema = new mongoose.Schema({
	routeNumber: {type:  Number},
	typeReception: {type: String, require: true},
	routeStatus: {type: String},
	idUserSend: {type: String},
	userSend: { type: mongoose.Schema.ObjectId, ref: "User"},
	typeRecipient: {type: String},
	idRecipient: {type: String}, //CLIENT, BUSINESS, INSURANCE, USER
	recipient: {type: Object},
	dateRoute: {type: Date},
	dateReception: {type: Date},
	dateMessenger: {type: Date},
	dateReEntry: {type: Date},
	dateReturn: {type: Date},
	details: {type: String},
	observations: {type: String},
	dateCreate: {type: Date},
	userCreate: {type: String, require: true},
	branchCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

RouteSchema.plugin(autoIncrement.plugin, { model: 'Route', field: 'routeNumber', startAt: 1});

export default mongoose.model('Route', RouteSchema)
