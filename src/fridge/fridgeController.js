const fridgeService = require('./fridgeService');

const addItem = async (req, res) => {
    try {
        const item = await fridgeService.addItem(req.body);
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateItem = async (req, res) => {
    try {
        const item = await fridgeService.updateItem(req.params.id, req.body);
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        await fridgeService.deleteItem(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getItemById = async (req, res) => {
    try {
        const item = await fridgeService.getItemById(req.params.id);
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllItems = async (req, res) => {
    try {
        const items = await fridgeService.getAllItems();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    getAllItems
};