
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import Config from './../../configs/app';

const connection = mongoose.connect(Config.mongoose);
autoIncrement.initialize(connection);

let PickupSchema = new mongoose.Schema({
	pickupNumber: {type:  Number},
	typeSend: {type: String},
	pickupStatus: {type: String},
	idSend: {type: Object}, //CLIENT, BUSINESS, INSURANCE, USER
	send: {type: Object},
	idUserAddress: {type: String},
	userAddress: {type: mongoose.Schema.ObjectId, ref: "User"},
	datePickup: {type: String},
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

PickupSchema.plugin(autoIncrement.plugin, { model: 'Pickup', field: 'PickupNumber', startAt: 1});

export default mongoose.model('Pickup', PickupSchema)
