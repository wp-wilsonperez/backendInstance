
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const connection = mongoose.connect('mongodb://localhost/instance1');
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
	userUpdate: {type: String, require: true}
});

SendingSchema.plugin(autoIncrement.plugin, { model: 'Sending', field: 'sendingNumber', startAt: 1});

export default mongoose.model('Sending', SendingSchema)
