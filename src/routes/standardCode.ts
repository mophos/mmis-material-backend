'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { unitOfTime } from 'moment';
import * as co from 'co-express';

import { StandardCodeModel } from '../models/standardCode';
const router = express.Router();

const stdCode = new StandardCodeModel();

router.get('/labeler-status', (req, res, next) => {

  let db = req.db;

  stdCode.getLabelerStatus(db)
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

router.get('/labeler-types', (req, res, next) => {

  let db = req.db;

  stdCode.getLabelerTypes(db)
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

router.get('/countries', (req, res, next) => {

  let db = req.db;

  stdCode.getCountries(db)
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

router.get('/changwat', (req, res, next) => {

  let db = req.db;

  stdCode.getChangwat(db)
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

router.post('/ampur', (req, res, next) => {

  let db = req.db;
  let changwatCode = req.body.changwatCode;

  stdCode.getAmpur(db, changwatCode)
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

router.post('/tambon', (req, res, next) => {

  let db = req.db;
  let changwatCode = req.body.changwatCode;
  let ampurCode = req.body.ampurCode;

  stdCode.getTambon(db, ampurCode, changwatCode)
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

router.get('/generic-types', (req, res, next) => {

  let db = req.db;

  stdCode.getGenericTypes(db)
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

router.get('/type-product', async (req, res, next) => {

  let db = req.db;

  try {
    let rs: any = await stdCode.getGenericHospType(db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
});


router.get('/generic-type-lv1', (req, res, next) => {

  let db = req.db;

  stdCode.getGenericTypeLV1(db)
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

router.get('/generic-type-lv2', (req, res, next) => {

  let db = req.db;
  let genericTypeLV1Id = req.query.genericTypeLV1Id;
  stdCode.getGenericTypeLV2(db, genericTypeLV1Id)
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

router.get('/generic-type-lv3', (req, res, next) => {

  let db = req.db;
  let genericTypeLV2Id = req.query.genericTypeLV2Id;
  let genericTypeLV1Id = req.query.genericTypeLV1Id;
  stdCode.getGenericTypeLV3(db, genericTypeLV1Id, genericTypeLV2Id)
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

router.get('/generic-groups/1', (req, res, next) => {

  let db = req.db;

  stdCode.getGenericGroups1(db)
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

router.get('/generic-groups/2', (req, res, next) => {

  let db = req.db;
  let groupCode1 = req.query.groupCode1;
  stdCode.getGenericGroups2(db, groupCode1)
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

router.get('/generic-groups/3', (req, res, next) => {

  let db = req.db;
  let groupCode1 = req.query.groupCode1;
  let groupCode2 = req.query.groupCode2;
  stdCode.getGenericGroups3(db, groupCode1, groupCode2)
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

router.get('/generic-groups/4', (req, res, next) => {

  let db = req.db;
  let groupCode1 = req.query.groupCode1;
  let groupCode2 = req.query.groupCode2;
  let groupCode3 = req.query.groupCode3;
  stdCode.getGenericGroups4(db, groupCode1, groupCode2, groupCode3)
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

router.get('/generic-dosages', (req, res, next) => {

  let db = req.db;

  stdCode.getGenericDosage(db)
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

router.get('/warehouses', (req, res, next) => {

  let db = req.db;

  stdCode.getWarehouseList(db)
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

router.get('/search/warehouses', (req, res, next) => {

  let db = req.db;
  let _query = req.query.query;

  stdCode.getWarehouseSearch(db, _query)
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

router.get('/product-groups', async (req, res, next) => {

  let db = req.db;

  try {
    let rs: any = await stdCode.getProductGroups(db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
});

router.get('/ed', async (req, res, next) => {

  let db = req.db;

  try {
    let rs: any = await stdCode.getED(db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    console.log(error);
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
});

router.get('/generic-accounts', co(async (req, res, next) => {

  let db = req.db;

  try {
    let rs: any = await stdCode.getGenericAccounts(db)
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.get('/bid-types', co(async (req, res, next) => {

  let db = req.db;

  try {
    let rs: any = await stdCode.getBitTypes(db)
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.get('/type-product', co(async (req, res, next) => {

  let db = req.db;

  try {
    let rs: any = await stdCode.getProductType(db)
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));
export default router;