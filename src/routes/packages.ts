'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { unitOfTime } from 'moment';

import { PackageModel } from '../models/package';
const router = express.Router();

const packageModel = new PackageModel();

router.get('/', (req, res, next) => {

  let db = req.db;

  packageModel.list(db)
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
  let largeUnit = req.body.largeUnit;
  let smallUnit = req.body.smallUnit;
  let largeQty = req.body.largeQty || 1;
  let smallQty = req.body.smalQty || 1;

  let db = req.db;

  if (largeUnit && smallUnit) {
    let datas: any = {
      large_unit: largeUnit,
      small_unit: smallUnit,
      large_qty: largeQty,
      small_qty: smallQty
    }

    packageModel.save(db, datas)
      .then((results: any) => {
        res.send({ ok: true })
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' }) ;
  }
});

router.put('/:packageId', (req, res, next) => {
  let packageId = req.params.packageId;
  let largeUnit = req.body.largeUnit;
  let smallUnit = req.body.smallUnit;
  let largeQty = +req.body.largeQty;
  let smallQty = +req.body.smallQty;

  let db = req.db;

  if (packageId) {
    let datas: any = {
      large_unit: largeUnit,
      small_unit: smallUnit,
      large_qty: largeQty,
      small_qty: smallQty
    }

    packageModel.update(db, packageId, datas)
      .then((results: any) => {
        res.send({ ok: true })
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' }) ;
  }
});

router.get('/detail/:packageId', (req, res, next) => {
  let packageId = req.params.packageId;
  let db = req.db;

  packageModel.detail(db, packageId)
    .then((results: any) => {
      res.send({ ok: true, detail: results[0] })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.delete('/:packageId', (req, res, next) => {
  let packageId = req.params.packageId;
  let db = req.db;

  packageModel.remove(db, packageId)
    .then((results: any) => {
      res.send({ ok: true })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

export default router;