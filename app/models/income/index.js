
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import Config from './../../configs/app';

const connection = mongoose.connect(Config.mongoose);
autoIncrement.initialize(connection);

let IncomeSchema = new mongoose.Schema({
	incomeNumber: {type:  Number},
	typeSend: {type: String},
	incomeStatus: {type: String},
	idSend: {type: Object}, //CLIENT, BUSINESS, INSURANCE, USER
	send: {type: Object},
	idUserAddress: {type: String},
	userAddress: {type: mongoose.Schema.ObjectId, ref: "User"},
	dateIncome: {type: String, require: true},
	dateReception: {type: String, require: true},
	details: {type: String, require: true},
	observations: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	branchCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

IncomeSchema.plugin(autoIncrement.plugin, { model: 'Income', field: 'incomeNumber', startAt: 1});

export default mongoose.model('Income', IncomeSchema)
