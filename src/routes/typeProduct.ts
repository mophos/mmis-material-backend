'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { typeProductModel } from '../models/typeProduct';
const router = express.Router();

const typeProduct = new typeProductModel();

router.get('/:btnD', (req, res, next) => {

  let db = req.db;
const btnD = req.params.btnD
  typeProduct.list(db,btnD)
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
router.delete('/re-deleted', (req, res, next) => {
  let typeId = req.query.id;
  let db = req.db;

  typeProduct.reRemove(db, typeId)
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
router.post('/', (req, res, next) => {
  let typeName = req.body.typeName;
  let prefixName = req.body.prefixName;

  let db = req.db;

  if (typeName) {
    let datas: any = {
      generic_type_name: typeName,
      prefix_name: prefixName,
      prefix_no: 1
    }

    typeProduct.save(db, datas)
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

router.put('/:typeId', (req, res, next) => {
  let typeId = req.params.typeId;
  let typeName = req.body.typeName;
  let prefixName = req.body.prefixName;

  let db = req.db;

  if (typeId) {
    let datas: any = {
      generic_type_name: typeName,
      prefix_name: prefixName
    }

    typeProduct.update(db, typeId, datas)
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

router.get('/detail/:typeId', (req, res, next) => {
  let typeId = req.params.typeId;
  let db = req.db;

  typeProduct.detail(db, typeId)
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

router.delete('/:typeId', (req, res, next) => {
  let typeId = req.params.typeId;
  let db = req.db;

  typeProduct.remove(db, typeId)
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