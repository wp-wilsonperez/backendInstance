
import mongoose from 'mongoose';

let FrequencyPaymentSchema = new mongoose.Schema({
	name: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('FrequencyPayment', FrequencyPaymentSchema)
