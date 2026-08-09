'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { ReceivePlanningModel } from '../models/receivePlanning';
const router = express.Router();

const receivePlanningModel = new ReceivePlanningModel();

router.get('/:genericId', (req, res, next) => {
  let db = req.db;
  let genericId = req.params.genericId;
  receivePlanningModel.list(db, genericId)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.post('/', (req, res, next) => {
  let db = req.db;
  let genericId: any = req.body.genericId;
  let warehouseId: any = req.body.warehouseId;
  receivePlanningModel.save(db, genericId, warehouseId)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.delete('/', (req, res, next) => {
  let db = req.db;
  let genericId: any = req.query.genericId;
  let warehouseId: any = req.query.warehouseId;
  receivePlanningModel.remove(db, genericId, warehouseId)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});


export default router;