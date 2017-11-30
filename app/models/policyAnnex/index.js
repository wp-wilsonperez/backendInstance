
import mongoose from 'mongoose';

let PolicyAnnexSchema = new mongoose.Schema({
	idPolicy: {type: String, require: true},
	policy: { type: mongoose.Schema.ObjectId, ref: "Policy"},
	annexNumber: {type: Number, require: true},
	certificateNumber: {type: Number, require: true},
	totalPrima: {type: Number, require: true},
	detailsAnnex: {type: String, require: true},
	superBank: {type: String, require: true},
	iva: {type: Number, require: true},
	segCamp: {type: String, require: true},
	valueIssue: {type: Number, require: true},
	others: {type: String},
	totalValue: {type: Number, require: true},
	hasBilling: {type: Boolean},
	isBilling: {type: Boolean},
	itemAnnex: {
		idRamo: {type: String},
		items: [{
			numberItem: {type: Number},
			travelfrom: {type: String},
			travelTo: {type: String},
			travelTransportation: {type: String},
			commodity: {type: String},
			coverage: {type: String},
			packaging: {type: String},
			application: {type: String},
			order: {type: String},
			provider: {type: String},
			limitPerShipment: {type: String},
			totalValueItem: {type: Number},
			totalValuePrimaItem: {type: Number},
			detailsItem: {type: String},
			observationsItem: {type: String},
			deductible: {type: String},
			validDays: {type: String},
			exclusionDate: {type: Date},
			inclusionDate: {type: Date},
			modificationDate: {type: Date},
			idCar: {type: String},
			tasa: {type: Number},
			carUse: {type: String},
			interest: {type: Number},
			carValue: {type: Number},
			amparoPatrimonial: {type: Number},
			rc: {type: String},
			others: {type: String},
			othersPrima: {type: Number},
			detailsCar: {type: String},
			prima: {type: Number},//end annexCar
			idPlanAlternative: {type: String},
			value: {type: Number},
			idClient: {type: String},
			alternative: {type: Object},
			annexDate: {type: Date},
			subItems: [{
				numberSubItem: {type: Number},
				name: {type: String},
				planAlternative: {type: String},
				ValueSubItem: {type: Number},
				tasa: {type: Number},
				calcFloat: {type: Number},
				primaNeta: {type: Number},
				detailsSubItem: {type: String},
				observationsSubItem: {type: String},
				exclusionDate: {type: Date},
				inclusionDate: {type: Date},
				modificationDate: {type: Date}
				extraDetails: {type: String},
				extraValue: {type: Number},
				extraTasa: {type: Number},
			}]
		}]
	},
	dateCreate: {type: Date, require: true},
	userCreate: {type: String, require: true},
	dateUpdate: {type: Date, require: true},
	userUpdate: {type: String, require: true}
});


export default mongoose.model('PolicyAnnex', PolicyAnnexSchema)
