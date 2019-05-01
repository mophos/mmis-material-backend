'use strict';

import * as express from 'express';
import * as moment from 'moment';

import { typeProductModel } from '../models/typeProduct';
const router = express.Router();

const typeProduct = new typeProductModel();

router.get('/', (req, res, next) => {
  let db = req.db;
  const deleted = req.query.deleted == 'false' ? false : true;
  typeProduct.list(db, deleted)
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

router.get('/lv1', (req, res, next) => {
  let db = req.db;
  const deleted = req.query.deleted == 'false' ? false : true;
  typeProduct.getGenericTypeLV1(db, deleted)
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

router.get('/lv2', (req, res, next) => {
  let db = req.db;
  const deleted = req.query.deleted == 'false' ? false : true;
  typeProduct.getGenericTypeLV2(db, deleted)
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

router.get('/lv3', (req, res, next) => {
  let db = req.db;
  const deleted = req.query.deleted == 'false' ? false : true;
  typeProduct.getGenericTypeLV3(db, deleted)
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

router.post('/return/lv1', (req, res, next) => {
  let typeId = req.body.id;
  let db = req.db;

  typeProduct.returnRemoveLV1(db, typeId)
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
router.post('/return/lv2', (req, res, next) => {
  let typeId = req.body.id;
  let db = req.db;

  typeProduct.returnRemoveLV2(db, typeId)
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
router.post('/return/lv3', (req, res, next) => {
  let typeId = req.body.id;
  let db = req.db;

  typeProduct.returnRemoveLV3(db, typeId)
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});


router.post('/lv1', (req, res, next) => {
  let genericTypeLV1Name = req.body.genericTypeLV1Name;
  let prefixName = req.body.prefixName;

  let db = req.db;

  if (genericTypeLV1Name) {
    let datas: any = {
      generic_type_name: genericTypeLV1Name,
      prefix_name: prefixName,
      prefix_no: 1
    }

    typeProduct.saveLv1(db, datas)
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.put('/lv1/:genericTypeLV1Id', (req, res, next) => {
  let genericTypeLV1Id = req.params.genericTypeLV1Id;
  let genericTypeLV1Name = req.body.genericTypeLV1Name;
  let prefixName = req.body.prefixName;

  let db = req.db;

  if (genericTypeLV1Id) {
    let datas: any = {
      generic_type_name: genericTypeLV1Name,
      prefix_name: prefixName
    }


    typeProduct.updateLV1(db, genericTypeLV1Id, datas)
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.post('/lv2', (req, res, next) => {
  let genericTypeLV2Name = req.body.genericTypeLV2Name;
  let genericTypeLV1Id = req.body.genericTypeLV1Id;

  let db = req.db;

  if (genericTypeLV2Name) {
    let datas: any = {
      generic_type_lv2_name: genericTypeLV2Name,
      generic_type_lv1_id: genericTypeLV1Id
    }

    typeProduct.saveLv2(db, datas)
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.put('/lv2/:genericTypeLV2Id', (req, res, next) => {
  let genericTypeLV2Id = req.params.genericTypeLV2Id;
  let genericTypeLV1Id = req.body.genericTypeLV1Id;
  let genericTypeLV2Name = req.body.genericTypeLV2Name;

  let db = req.db;

  if (genericTypeLV2Id) {
    let datas: any = {
      generic_type_lv2_name: genericTypeLV2Name,
      generic_type_lv1_id: genericTypeLV1Id
    }

    typeProduct.updateLV2(db, genericTypeLV2Id, datas)
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.post('/lv3', (req, res, next) => {
  let genericTypeLV3Name = req.body.genericTypeLV3Name;
  let genericTypeLV1Id = req.body.genericTypeLV1Id;
  let genericTypeLV2Id = req.body.genericTypeLV2Id;

  let db = req.db;

  if (genericTypeLV3Name) {
    let datas: any = {
      generic_type_lv3_name: genericTypeLV3Name,
      generic_type_lv2_id: genericTypeLV2Id,
      generic_type_lv1_id: genericTypeLV1Id
    }

    typeProduct.saveLv3(db, datas)
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.put('/lv3/:genericTypeLV3Id', (req, res, next) => {
  let genericTypeLV3Id = req.params.genericTypeLV3Id;
  let genericTypeLV1Id = req.body.genericTypeLV1Id;
  let genericTypeLV2Id = req.body.genericTypeLV2Id;
  let genericTypeLV3Name = req.body.genericTypeLV3Name;

  let db = req.db;

  if (genericTypeLV3Id) {
    let datas: any = {
      generic_type_lv3_name: genericTypeLV3Name,
      generic_type_lv1_id: genericTypeLV1Id,
      generic_type_lv2_id: genericTypeLV2Id
    }

    typeProduct.updateLV3(db, genericTypeLV3Id, datas)
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
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

router.delete('/lv1/:typeId', (req, res, next) => {
  let typeId = req.params.typeId;
  let db = req.db;

  typeProduct.removeLV1(db, typeId)
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

router.delete('/lv2/:typeId', (req, res, next) => {
  let typeId = req.params.typeId;
  let db = req.db;

  typeProduct.removeLV2(db, typeId)
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

router.delete('/lv3/:typeId', (req, res, next) => {
  let typeId = req.params.typeId;
  let db = req.db;

  typeProduct.removeLV3(db, typeId)
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