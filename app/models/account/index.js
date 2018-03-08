
import mongoose from 'mongoose';

let AccountSchema = new mongoose.Schema({
	name: {type: String, require: true},
	logo: {type: String},
	img1: {type: String},
	img2: {type: String},
	img3: {type: String},
	parking: {type: Boolean},
	description: {type: String},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

export default mongoose.model('Account', AccountSchema)
