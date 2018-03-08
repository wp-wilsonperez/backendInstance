
import mongoose from 'mongoose';

let BinnacleExpirationDateSchema = new mongoose.Schema({
	idExpirationDate: {type: String, require: true},
	expirationDate: { type: mongoose.Schema.ObjectId, ref: "ExpirationDate"},
	callCenterComments: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('BinnacleExpirationDate', BinnacleExpirationDateSchema)
