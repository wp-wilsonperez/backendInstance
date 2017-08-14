
import mongoose from 'mongoose';

let AlternativeSchema = new mongoose.Schema({
	name: {type: String, require: true},
	value: {type: Number, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('Alternative', AlternativeSchema)
