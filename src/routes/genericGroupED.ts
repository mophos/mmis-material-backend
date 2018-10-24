import { GenericGroupEDRouteModel } from './../models/genericGroupED';
'use strict';

import * as express from 'express';
import * as moment from 'moment';
import * as warp from 'co-express';

const router = express.Router();

const genericGroupEDRouteModel = new GenericGroupEDRouteModel();


router.delete('/', warp(async (req, res, next) => {
  let db = req.db;
  const genericGroupEDId = req.query.genericGroupEDId;
  try {
    const rs = await genericGroupEDRouteModel.remove(db, genericGroupEDId);
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
  const genericGroupEDId = req.body.genericGroupEDId;
  try {
    const rs = await genericGroupEDRouteModel.returnRemove(db, genericGroupEDId);
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
    const rs = await genericGroupEDRouteModel.list(db, deleted);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.post('/', warp(async (req, res, next) => {
  let db = req.db;
  let genericGroupEDName = req.body.genericGroupEDName;
  try {
    const rs = await genericGroupEDRouteModel.save(db, genericGroupEDName);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.put('/', warp(async (req, res, next) => {
  let db = req.db;
  let genericGroupEDId = req.body.genericGroupEDId;
  let genericGroupEDName = req.body.genericGroupEDName;
  try {
    const rs = await genericGroupEDRouteModel.update(db, genericGroupEDId, genericGroupEDName);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));


export default router;
