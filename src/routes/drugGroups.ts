'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { unitOfTime } from 'moment';

import { DrugGroupModel } from '../models/drugGroups';
const router = express.Router();

const groupModel = new DrugGroupModel();

router.get('/all', (req, res, next) => {
  let db = req.db;
  groupModel.listAll(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results[0] });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

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

// ############## GROUP 1 #####################
router.get('/group/1', (req, res, next) => {
  let db = req.db;
  let isActived = req.query.isActived;
  groupModel.group1(db, isActived)
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

router.post('/group1', (req, res, next) => {
  let groupName1 = req.body.groupName1;
  let groupCode1 = req.body.groupCode1;

  let db = req.db;

  if (groupName1) {
    let datas: any = {
      group_name_1: groupName1,
      group_code_1: groupCode1
    }

    groupModel.saveGroup1(db, datas)
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

router.put('/group1', (req, res, next) => {
  let groupCode1 = req.body.groupCode1;
  let groupName1 = req.body.groupName1;
  console.log(groupCode1);

  let db = req.db;

  groupModel.updateGroup1(db, groupCode1, groupName1)
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

router.put('/active/group1', (req, res, next) => {
  let groupId = req.query.groupId;
  let status = req.body.status;
  let db = req.db;
  groupModel.activeGroup1(db, groupId, status)
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

router.delete('/group1', (req, res, next) => {
  let groupCode1 = req.query.groupCode1;
  let db = req.db;

  groupModel.removeGroup1(db, groupCode1)
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
// ################################################
// ############## GROUP 2 #####################
router.get('/group/2', (req, res, next) => {
  let db = req.db;
  let isActived = req.query.isActived;
  groupModel.group2(db, isActived)
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

router.post('/group2', (req, res, next) => {
  let groupName2 = req.body.groupName2;
  let groupCode2 = req.body.groupCode2;
  let groupCode1 = req.body.groupCode1;

  let db = req.db;

  if (groupName2) {
    let datas: any = {
      group_name_2: groupName2,
      group_code_2: groupCode2,
      group_code_1: groupCode1
    }

    groupModel.saveGroup2(db, datas)
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

router.put('/group2', (req, res, next) => {
  let groupCode1 = req.body.groupCode1;
  let groupCode2 = req.body.groupCode2;
  let groupName2 = req.body.groupName2;
  console.log(groupCode2);

  let db = req.db;

  groupModel.updateGroup2(db, groupCode1, groupCode2, groupName2)
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

router.put('/active/group2', (req, res, next) => {
  let groupCode1 = req.query.groupCode1;
  let groupCode2 = req.query.groupCode2;
  let status = req.body.status;
  let db = req.db;
  groupModel.activeGroup2(db, groupCode1, groupCode2, status)
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

router.delete('/group2', (req, res, next) => {
  let groupCode2 = req.query.groupCode2;
  let db = req.db;

  groupModel.removeGroup2(db, groupCode2)
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