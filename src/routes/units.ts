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
  const deleted: any = req.query.deleted == 'false' ? false : true;
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
  const query: any = req.query.query || '';
  const deleted: any = req.query.deleted == 'false' ? false : true;
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
  const unitName: any = req.body.unitName;
  const unitEng: any = req.body.unitEng;
  const unitCode: any = req.body.unitCode;
  const isActive: any = req.body.isActive;
  const isPrimary: any = req.body.isPrimary;

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
  const unitName: any = req.body.unitName;
  const unitEng: any = req.body.unitEng;
  const unitCode: any = req.body.unitCode;
  const isActive: any = req.body.isActive;
  const isPrimary: any = req.body.isPrimary;

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
  let unitId: any = req.body.unitId;
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
  const fromUnitId: any = req.body.fromUnitId;
  const toUnitId: any = req.body.toUnitId;
  const qty = +req.body.qty;
  const isActive: any = req.body.isActive;
  const cost = +req.body.cost;
  const standard_cost = +req.body.standard_cost;

  const db = req.db;

  try {
    const data = {
      generic_id: genericId,
      from_unit_id: fromUnitId,
      to_unit_id: toUnitId,
      qty: qty,
      is_active: isActive,
      cost: cost,
      standard_cost: standard_cost
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
  const unitGenericId: any = req.body.unitGenericId;
  const genericId: any = req.body.genericId;

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
  const unitGenericId: any = req.body.unitGenericId;
  const status: any = req.body.status;

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

router.put('/update/Conversion', co(async (req, res, next) => {
  const genericId: any = req.body.genericId;
  const unitGenericId: any = req.body.unitGenericId;
  const fromUnitId: any = req.body.fromUnitId;
  const toUnitId: any = req.body.toUnitId;
  const qty = +req.body.qty;
  const cost = +req.body.cost;
  const standard_cost = +req.body.standard_cost;
  console.log('@@@@@', genericId);

  const db = req.db;

  try {
    const data = {
      from_unit_id: fromUnitId,
      to_unit_id: toUnitId,
      qty: qty,
      cost: cost,
      standard_cost: standard_cost
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