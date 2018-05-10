'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { unitOfTime } from 'moment';

import { DrugDosageModel } from '../models/drugDosages';
const router = express.Router();

const dosageModel = new DrugDosageModel();

router.get('/', (req, res, next) => {
  let db = req.db;

  dosageModel.list(db)
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

router.get('/all', (req, res, next) => {
  let db = req.db;

  dosageModel.listAll(db)
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
  let dosageName = req.body.dosageName;

  let db = req.db;

  if (dosageName) {
    let datas: any = {
      dosage_name: dosageName
    }

    dosageModel.save(db, datas)
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

router.put('/:dosageId', (req, res, next) => {
  let dosageId = req.params.dosageId;
  let dosageName = req.body.dosageName;

  let db = req.db;

  if (dosageId) {
    let datas: any = {
      dosage_name: dosageName
    }

    dosageModel.update(db, dosageId, datas)
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

router.post('/isactive', (req, res, next) => {
  let db = req.db;
  let id = req.body.id;
  let isActive = req.body.isActive;
  console.log(id,isActive,'55555');
  
  let is_active = {
    is_active:isActive
  }
  dosageModel.isactive(db,id,is_active)
    .then((results: any) => {
      res.send({ ok: true });
    })
    .catch(error => {
      res.send({ ok: false })
    })
    .finally(() => {
      db.destroy();
    });
});

router.delete('/:dosageId', (req, res, next) => {
  let dosageId = req.params.dosageId;
  let db = req.db;

  dosageModel.remove(db, dosageId)
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