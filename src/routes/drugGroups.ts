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
  let isDeleted = req.query.isDeleted;  
  groupModel.group1(db, isActived, isDeleted)
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
router.post('/return1', (req, res, next) => {
  let id = req.body.id;
  let db = req.db;

  groupModel.returnRemove1(db, id.group_code_1)
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
  let isDeleted = req.query.isDeleted;  
  groupModel.group2(db, isActived, isDeleted)
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
  let groupCode1 = req.query.groupCode1;
  let groupCode2 = req.query.groupCode2;
  let db = req.db;

  groupModel.removeGroup2(db, groupCode1, groupCode2)
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
router.post('/return2', (req, res, next) => {
  let id = req.body.id;
  let db = req.db;

  groupModel.returnRemove2(db, id.group_code_1, id.group_code_2)
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
// ############## GROUP 3 #####################
router.get('/group/3', (req, res, next) => {
  let db = req.db;
  let isActived = req.query.isActived;
  let isDeleted = req.query.isDeleted;  
  groupModel.group3(db, isActived, isDeleted)
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

router.post('/group3', (req, res, next) => {
  let groupName3 = req.body.groupName3;
  let groupCode3 = req.body.groupCode3;
  let groupCode2 = req.body.groupCode2;
  let groupCode1 = req.body.groupCode1;

  let db = req.db;

  if (groupName3) {
    let datas: any = {
      group_name_3: groupName3,
      group_code_3: groupCode3,
      group_code_2: groupCode2,
      group_code_1: groupCode1
    }

    groupModel.saveGroup3(db, datas)
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

router.put('/group3', (req, res, next) => {
  let groupCode1 = req.body.groupCode1;
  let groupCode2 = req.body.groupCode2;
  let groupCode3 = req.body.groupCode3;
  let groupName3 = req.body.groupName3;

  let db = req.db;

  groupModel.updateGroup3(db, groupCode1, groupCode2, groupCode3, groupName3)
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

router.put('/active/group3', (req, res, next) => {
  let groupCode1 = req.query.groupCode1;
  let groupCode2 = req.query.groupCode2;
  let groupCode3 = req.query.groupCode3;
  let status = req.body.status;
  let db = req.db;
  groupModel.activeGroup3(db, groupCode1, groupCode2, groupCode3, status)
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

router.delete('/group3', (req, res, next) => {
  let groupCode1 = req.query.groupCode1;
  let groupCode2 = req.query.groupCode2;
  let groupCode3 = req.query.groupCode3;
  let db = req.db;

  groupModel.removeGroup3(db, groupCode1, groupCode2, groupCode3)
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
router.post('/return3', (req, res, next) => {
  let id = req.body.id;
  let db = req.db;

  groupModel.returnRemove3(db, id.group_code_1, id.group_code_2, id.group_code_3)
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
// ############## GROUP 4 #####################
router.get('/group/4', (req, res, next) => {
  let db = req.db;
  let isActived = req.query.isActived;
  let isDeleted = req.query.isDeleted;  
  groupModel.group4(db, isActived, isDeleted)
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

router.post('/group4', (req, res, next) => {
  let groupName4 = req.body.groupName4;
  let groupCode4 = req.body.groupCode4;
  let groupCode3 = req.body.groupCode3;
  let groupCode2 = req.body.groupCode2;
  let groupCode1 = req.body.groupCode1;

  let db = req.db;

  if (groupName4) {
    let datas: any = {
      group_name_4: groupName4,
      group_code_4: groupCode4,
      group_code_3: groupCode3,
      group_code_2: groupCode2,
      group_code_1: groupCode1
    }

    groupModel.saveGroup4(db, datas)
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

router.put('/group4', (req, res, next) => {
  let groupCode1 = req.body.groupCode1;
  let groupCode2 = req.body.groupCode2;
  let groupCode3 = req.body.groupCode3;
  let groupCode4 = req.body.groupCode4;
  let groupName4 = req.body.groupName4;

  let db = req.db;

  groupModel.updateGroup4(db, groupCode1, groupCode2, groupCode3, groupCode4, groupName4)
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

router.put('/active/group4', (req, res, next) => {
  let groupCode1 = req.query.groupCode1;
  let groupCode2 = req.query.groupCode2;
  let groupCode3 = req.query.groupCode3;
  let groupCode4 = req.query.groupCode4;
  let status = req.body.status;
  let db = req.db;
  groupModel.activeGroup4(db, groupCode1, groupCode2, groupCode3, groupCode4, status)
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

router.delete('/group4', (req, res, next) => {
  let groupCode1 = req.query.groupCode1;
  let groupCode2 = req.query.groupCode2;
  let groupCode3 = req.query.groupCode3;
  let groupCode4 = req.query.groupCode4;
  let db = req.db;

  groupModel.removeGroup4(db, groupCode1, groupCode2, groupCode3, groupCode4)
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
router.post('/return4', (req, res, next) => {
  let id = req.body.id;
  let db = req.db;

  groupModel.returnRemove4(db, id.group_code_1, id.group_code_2, id.group_code_3, id.group_code_4)
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