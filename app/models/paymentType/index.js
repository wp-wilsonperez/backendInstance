
import mongoose from 'mongoose';

let PaymentTypeSchema = new mongoose.Schema({
	name: {type: String, require: true},
	initialPayment: {type: Number, require: true},
	equalPayments: {type: Number, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('PaymentType', PaymentTypeSchema)
