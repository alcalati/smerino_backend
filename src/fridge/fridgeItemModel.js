const mongoose = require('mongoose');

const fridgeItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: Number, required: true },
    expireDate: { type: Date, required: true }
});

const FridgeItem = mongoose.model('FridgeItem', fridgeItemSchema);

module.exports = FridgeItem;