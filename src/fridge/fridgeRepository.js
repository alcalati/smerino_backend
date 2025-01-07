const FridgeItem = require('./fridgeItemModel');

const addItem = async (itemData) => {
    const item = new FridgeItem(itemData);
    return await item.save();
};

const updateItem = async (id, itemData) => {
    return await FridgeItem.findByIdAndUpdate(id, itemData, { new: true });
};

const deleteItem = async (id) => {
    return await FridgeItem.findByIdAndDelete(id);
};

const getItemById = async (id) => {
    return await FridgeItem.findById(id);
};

const getAllItems = async () => {
    return await FridgeItem.find();
};

module.exports = {
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    getAllItems
};