const fridgeRepository = require('./fridgeRepository');

const addItem = async (itemData) => {
    return await fridgeRepository.addItem(itemData);
};

const updateItem = async (id, itemData) => {
    return await fridgeRepository.updateItem(id, itemData);
};

const deleteItem = async (id) => {
    return await fridgeRepository.deleteItem(id);
};

const getItemById = async (id) => {
    return await fridgeRepository.getItemById(id);
};

const getAllItems = async () => {
    return await fridgeRepository.getAllItems();
};

module.exports = {
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    getAllItems
};