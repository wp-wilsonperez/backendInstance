
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Config from './../../configs/app';

const connection = mongoose.connect(Config.mongoose);
autoIncrement.initialize(connection);

let SendingSchema = new mongoose.Schema({
	sendingNumber: {type:  Number},
	typeSend: {type: String},
	sendingStatus: {type: String},
	idSend: {type: Object}, //CLIENT, BUSINESS, INSURANCE, USER
	send: {type: Object},
	idUserAddress: {type: String},
	userAddress: {type: mongoose.Schema.ObjectId, ref: "User"},
	dateSending: {type: String},
	dateReception: {type: String},
	details: {type: String},
	observations: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	branchCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

SendingSchema.plugin(autoIncrement.plugin, { model: 'Sending', field: 'sendingNumber', startAt: 1});

export default mongoose.model('Sending', SendingSchema)
