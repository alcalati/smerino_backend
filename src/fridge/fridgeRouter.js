const express = require('express');
const { addItem, updateItem, deleteItem, getItemById, getAllItems } = require('./fridgeController');
const router = express.Router();

// Ruta para agregar un ítem
router.post('/add', addItem);

// Ruta para actualizar un ítem
router.put('/update/:id', updateItem);

// Ruta para eliminar un ítem
router.delete('/delete/:id', deleteItem);

// Ruta para obtener un ítem por ID
router.get('/item/:id', getItemById);

// Ruta para obtener todos los ítems
router.get('/items', getAllItems);

module.exports = router;