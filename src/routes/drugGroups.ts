'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { unitOfTime } from 'moment';

import { DrugGroupModel } from '../models/drugGroups';
const router = express.Router();

const groupModel = new DrugGroupModel();

router.get('/', (req, res, next) => {
  let db = req.db;

  groupModel.list(db)
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
  let groupName = req.body.groupName;
  let groupCode = req.body.groupCode;

  let db = req.db;

  if (groupName) {
    let datas: any = {
      group_name: groupName,
      group_code: groupCode
    }

    groupModel.save(db, datas)
      .then((results: any) => {
        res.send({ ok: true, rows: results })
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

router.put('/:groupId', (req, res, next) => {
  let groupId = req.params.groupId;
  let groupName = req.body.groupName;
  let groupCode = req.body.groupCode;
  console.log(groupCode);
  
  let db = req.db;

  if (groupId) {
    let datas: any = {
      group_name: groupName,
      group_code: groupCode
    }

    groupModel.update(db, groupId, datas)
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

router.put('/active', (req, res, next) => {
  let groupId = req.query.groupId;
  let status = req.query.status;
  let db = req.db;
    groupModel.active(db, groupId, status)
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

router.delete('/:groupId', (req, res, next) => {
  let groupId = req.params.groupId;
  let db = req.db;

  groupModel.remove(db, groupId)
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