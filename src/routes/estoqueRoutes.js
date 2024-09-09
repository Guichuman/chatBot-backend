import express from 'express';
import { estoqueController } from '../controllers/estoqueController.js';

const router = express.Router();

router.post('/', estoqueController.create);
router.get('/', estoqueController.findAll);
router.get('/:id', estoqueController.findById);
router.put('/:id', estoqueController.update);
router.delete('/:id', estoqueController.delete);

export default router;
