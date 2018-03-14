import * as express from 'express';
import * as moment from 'moment';
import * as wrap from 'co-express';

import { OrderModifierModel } from '../models/order-modifier';
const router = express.Router();

const modifierModel = new OrderModifierModel();

router.post('/:productId', wrap(async (req, res, next) => {
  const db = req.db;
  const minQty = req.body.minQty;
  const maxQty = req.body.maxQty;
  const productId = req.params.productId;
  const warehouseId = req.body.warehouseId;
  const unitId = req.body.unitId;
  const isActive = req.body.isActive;
  try {
    const data = {
      product_id: productId,
      warehouse_id: warehouseId,
      min_qty: +minQty,
      max_qty: +maxQty,
      is_active: isActive
    }
    await modifierModel.save(db, data);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/:productId', wrap(async (req, res, next) => {
  const db = req.db;
  const productId = req.params.productId;
  try {
    const rows = await modifierModel.getOrderModifiers(db, productId);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.put('/:productOrderModifierId', wrap(async (req, res, next) => {
  const db = req.db;
  const minQty = +req.body.minQty;
  const maxQty = +req.body.maxQty;
  const productOrderModifierId = req.params.productOrderModifierId;
  const unitId = req.body.unitId;
  const isActive = req.body.isActive;
  try {
    const data = {
      min_qty: +minQty,
      max_qty: +maxQty,
      is_active: isActive,
      unit_id: unitId
    }
    await modifierModel.update(db, productOrderModifierId, minQty, maxQty, isActive);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.delete('/:productOrderModifierId', wrap(async (req, res, next) => {
  const db = req.db;
  const productOrderModifierId = req.params.productOrderModifierId;
  try {
    await modifierModel.remove(db, productOrderModifierId);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

export default router;