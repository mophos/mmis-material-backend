import * as express from 'express';
import * as moment from 'moment';
import * as co from 'co-express';

import { UnitModel } from '../models/units';
import { ProductModel } from '../models/product';
const router = express.Router();

const unitModel = new UnitModel();
const productModel = new ProductModel();

router.get('/', co(async (req, res, next) => {
  const db = req.db;
  const deleted = req.query.deleted == 'false' ? false : true;
  try {
    const rows = await unitModel.list(db, deleted);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/search', co(async (req, res, next) => {
  const db = req.db;
  const query = req.query.query || '';
  const deleted = req.query.deleted == 'false' ? false : true;
  try {
    const rows = await unitModel.search(db, query, deleted);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/primary', co(async (req, res, next) => {
  const db = req.db;

  try {
    const rows = await unitModel.listPrimary(db);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/generic/primary-unit/:genericId', co(async (req, res, next) => {
  const db = req.db;
  const genericId = req.params.genericId;

  try {
    const rows = await unitModel.getGenericPrimaryUnit(db, genericId);
    res.send({ ok: true, unitId: rows[0].primary_unit_id, unitName: rows[0].unit_name });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/active-primary', co(async (req, res, next) => {
  const db = req.db;

  try {
    const rows = await unitModel.listActivePrimary(db);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/active', co(async (req, res, next) => {
  const db = req.db;

  try {
    const rows = await unitModel.listActive(db);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/active/:genericId', co(async (req, res, next) => {
  const db = req.db;
  const genericId = req.params.genericId;

  try {
    const rows = await unitModel.listGenericActive(db, genericId);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/not-primary', co(async (req, res, next) => {
  const db = req.db;

  try {
    const rows = await unitModel.listNotPrimary(db);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.post('/', co(async (req, res, next) => {
  const unitName = req.body.unitName;
  const unitEng = req.body.unitEng;
  const unitCode = req.body.unitCode;
  const isActive = req.body.isActive;
  const isPrimary = req.body.isPrimary;

  const db = req.db;

  if (unitName && unitCode) {
    let datas: any = {
      unit_name: unitName,
      unit_code: unitCode,
      unit_eng: unitEng,
      is_active: isActive,
      is_primary: isPrimary
    }

    try {
      await unitModel.save(db, datas);
      res.send({ ok: true });
    } catch (error) {
      res.send({ ok: false, error: error.message })
    } finally {
      db.destroy();
    }

  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
}));

router.put('/:unitId', co(async (req, res, next) => {
  const unitId = req.params.unitId;
  const unitName = req.body.unitName;
  const unitEng = req.body.unitEng;
  const unitCode = req.body.unitCode;
  const isActive = req.body.isActive;
  const isPrimary = req.body.isPrimary;

  let db = req.db;

  if (unitId && unitName && unitCode) {
    let datas: any = {
      unit_name: unitName,
      unit_code: unitCode,
      unit_eng: unitEng,
      is_active: isActive,
      is_primary: isPrimary
    }

    try {
      await unitModel.update(db, unitId, datas);
      res.send({ ok: true });
    } catch (error) {
      res.send({ ok: false, error: error.message });
    } finally {
      db.destroy();
    }

  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
}));

router.get('/detail/:unitId', co(async (req, res, next) => {
  let unitId = req.params.unitId;
  let db = req.db;

  try {
    const result = await unitModel.detail(db, unitId);
    res.send({ ok: true, detail: result[0] });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

router.delete('/:unitId', co(async (req, res, next) => {
  let unitId = req.params.unitId;
  let db = req.db;

  try {
    await unitModel.remove(db, unitId);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

router.post('/return', co(async (req, res, next) => {
  let unitId = req.body.unitId;
  let db = req.db;

  try {
    let rs = await unitModel.return(db, unitId);
    if (rs) {
      res.send({ ok: true });
    } else {
      res.send({ ok: false });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));


// unit conversion

router.post('/conversion/:genericId', co(async (req, res, next) => {
  const genericId = req.params.genericId;
  const fromUnitId = req.body.fromUnitId;
  const toUnitId = req.body.toUnitId;
  const qty = +req.body.qty;
  const isActive = req.body.isActive;
  const cost = +req.body.cost;

  const db = req.db;

  try {
    const data = {
      generic_id: genericId,
      from_unit_id: fromUnitId,
      to_unit_id: toUnitId,
      qty: qty,
      is_active: isActive,
      cost: cost
    }
    const rs = await unitModel.checkConversionDuplicated(db, genericId, fromUnitId, toUnitId, qty);
    if (rs.length > 0) {
      if (rs[0].total > 0) {
        res.send({ ok: false, error: 'รายการซ้ำ' });
      } else {
        await unitModel.saveConversion(db, data);
        res.send({ ok: true });
      }
    } else {
      await unitModel.saveConversion(db, data);
      res.send({ ok: true });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

router.put('/conversion/planning', co(async (req, res, next) => {
  const unitGenericId = req.body.unitGenericId;
  const genericId = req.body.genericId;

  const db = req.db;

  try {
    const total = await unitModel.updateConversionPlanning(db, genericId, unitGenericId);
    res.send({ ok: true });

  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

router.put('/conversion/active', co(async (req, res, next) => {
  const unitGenericId = req.body.unitGenericId;
  const status = req.body.status;

  const db = req.db;

  try {
    const total = await unitModel.updateActive(db, unitGenericId, status);
    res.send({ ok: true });

  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

router.put('/conversion', co(async (req, res, next) => {
  const genericId = req.body.genericId;
  const unitGenericId = req.body.unitGenericId;
  const fromUnitId = req.body.fromUnitId;
  const toUnitId = req.body.toUnitId;
  const qty = +req.body.qty;
  const cost = +req.body.cost;
  console.log('@@@@@', req.body);

  const db = req.db;

  try {
    const data = {
      from_unit_id: fromUnitId,
      to_unit_id: toUnitId,
      qty: qty,
      cost: cost
    }
    console.log(data);

    const total = await unitModel.checkConversionDuplicatedUpdate(db, unitGenericId, genericId, fromUnitId, toUnitId, qty);
    if (total[0].total > 0) {
      res.send({ ok: false, error: 'รายการซ้ำ' });
    } else {
      await unitModel.updateConversion(db, unitGenericId, data);
      res.send({ ok: true });
    }
  } catch (error) {
    console.log(error);

    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

// conversion list
router.get('/conversion/:genericId', co(async (req, res, next) => {
  let genericId = req.params.genericId;
  let db = req.db;

  try {
    const rows = await unitModel.getConversionList(db, genericId);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

router.delete('/conversion/:unitGenericId', co(async (req, res, next) => {
  let unitGenericId = req.params.unitGenericId;
  let db = req.db;

  try {
    await unitModel.removeConversion(db, unitGenericId);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));


export default router;