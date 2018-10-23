import { ProductGroupsModel } from './../models/productGroups';
'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as warp from 'co-express';

const router = express.Router();

const productGroupModel = new ProductGroupsModel();


router.delete('/', warp(async (req, res, next) => {
  let db = req.db;
  const productGroupId = req.query.productGroupId;
  try {
    const rs = await productGroupModel.remove(db, productGroupId);
    if (rs) {
      res.send({ ok: true });
    } else {
      res.send({ ok: false });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.post('/return', warp(async (req, res, next) => {
  let db = req.db;
  const productGroupId = req.body.productGroupId;
  try {
    const rs = await productGroupModel.return(db, productGroupId);
    if (rs) {
      res.send({ ok: true });
    } else {
      res.send({ ok: false });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.get('/', warp(async (req, res, next) => {
  let db = req.db;
  const deleted = req.query.deleted == 'false' ? false : true;
  try {
    const rs = await productGroupModel.list(db, deleted);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.post('/', warp(async (req, res, next) => {
  let db = req.db;
  let productGroupName = req.body.productGroupName;
  try {
    const rs = await productGroupModel.save(db, productGroupName);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.put('/', warp(async (req, res, next) => {
  let db = req.db;
  let productGroupId = req.body.productGroupId;
  let productGroupName = req.body.productGroupName;
  try {
    const rs = await productGroupModel.update(db, productGroupId, productGroupName);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));


export default router;
