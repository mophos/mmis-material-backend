import * as express from 'express';
import * as moment from 'moment';
import { DrugAccountModel } from '../models/drugAccounts';

const router = express.Router();

const drugAccountModel = new DrugAccountModel();

router.get('/', (req, res, next) => {

  let db = req.db;

  drugAccountModel.list(db)
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
  let drugAccountName = req.body.drugAccountName;

  let db = req.db;

  if (drugAccountName) {
    let datas: any = {
      name: drugAccountName
    }

    drugAccountModel.save(db, datas)
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

router.put('/:drugAccountId', (req, res, next) => {
  let drugAccountId = req.params.drugAccountId;
  let drugAccountName = req.body.drugAccountName;

  let db = req.db;

  if (drugAccountId) {
    let datas: any = {
      name: drugAccountName
    }

    drugAccountModel.update(db, drugAccountId, datas)
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

router.get('/detail/:drugAccountId', (req, res, next) => {
  let drugAccountId = req.params.drugAccountId;
  let db = req.db;

  drugAccountModel.detail(db, drugAccountId)
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

router.delete('/:drugAccountId', (req, res, next) => {
  let drugAccountId = req.params.drugAccountId;
  let db = req.db;

  drugAccountModel.remove(db, drugAccountId)
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