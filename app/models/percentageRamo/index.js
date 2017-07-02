
import mongoose from 'mongoose';

let PercentageRamoSchema = new mongoose.Schema({
	idRamo: {type: String, require: true},
	idInsurance: {type: String, require: true},
	value: {type: String, require: true},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('PercentageRamo', PercentageRamoSchema)