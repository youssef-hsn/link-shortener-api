import express from 'express';
import { createAlias, getAlias, updateAlias, deleteAlias } from '../controllers/alias.controller.js';

const router = express.Router();

router.get('/:alias', getAlias);
router.post('/', createAlias);
router.put('/:alias', updateAlias);
router.delete('/:alias', deleteAlias);

export default router;