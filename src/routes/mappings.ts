import { MappingModel } from '../models/mapping';
import * as express from 'express';
import * as moment from 'moment';

import * as wrap from 'co-express';

const router = express.Router();

const mappingModel = new MappingModel();

router.get('/edi-labeler-code', wrap(async (req, res, next) => {
  const db = req.db;
  const productId = req.query.productId;

  try {
    const results = await mappingModel.getEdiLabelerCode(db, productId)
    res.send({ ok: true, rows: results[0].edi_labeler_code });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.post('/edi-labeler-code', wrap(async (req, res, next) => {
  const db = req.db;
  const productId = req.body.productId;
  const ediLabelerCode = req.body.ediLabelerCode;

  try {
    const results = await mappingModel.saveEdiLabelerCode(db, productId, ediLabelerCode)
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

export default router;
