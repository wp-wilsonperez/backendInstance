
import mongoose from 'mongoose';

let CarModelSchema = new mongoose.Schema({
	name: {type: String, require: true},
	cylinder: {type: String, require: true},
	year: {type: String, require: true},
	idCountry: {type: String, require: true},
	country: { type: mongoose.Schema.ObjectId, ref: "Country"},
	idCarBrand: {type: String, require: true},
	carBrand: { type: mongoose.Schema.ObjectId, ref: "CarBrand"},
	idCarType: {type: String, require: true},
	carType: { type: mongoose.Schema.ObjectId, ref: "CarType"},
	idColor: {type: String, require: true},
	color: { type: mongoose.Schema.ObjectId, ref: "Color"},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true},
	dateDelete: {type: Date}
});


export default mongoose.model('CarModel', CarModelSchema)
