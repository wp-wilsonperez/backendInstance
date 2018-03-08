
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let CitySchema = new mongoose.Schema({
	name: {type: String, require: true, unique : true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});

CitySchema.plugin(uniqueValidator);

export default mongoose.model('City', CitySchema)
