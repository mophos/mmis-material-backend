'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { unitOfTime } from 'moment';
import * as co from 'co-express';

import { GenericsModel } from '../models/generics';
import { SerialModel } from '../models/serial';
const router = express.Router();

const genericModel = new GenericsModel();
const serialModel = new SerialModel();

router.post('/list-type', co(async (req, res, next) => {
  let db = req.db;
  let limit: any = req.body.limit;
  let offset: any = req.body.offset;
  let typeId: any = req.body.typeId;
  let deleted: any = req.body.deleted;
  let sort: any = req.body.sort;
  if (typeof typeId === 'string') {
    typeId = [typeId];
  }

  try {

    let rs = await genericModel.getListByType(db, limit, offset, typeId, deleted, sort);
    let rsTotal = await genericModel.getTotalByType(db, typeId, deleted);
    res.send({ ok: true, rows: rs, total: rsTotal[0].total });

  } catch (error) {
    res.send({ ok: false, error: error });
  } finally {
    db.destroy();
  }

}));

router.post('/search', co(async (req, res, next) => {
  let db = req.db;
  let limit: any = req.body.limit;
  let offset: any = req.body.offset;
  let query: any = req.body.query || '';
  let genericType: any = req.body.genericType;
  let deleted: any = req.body.deleted;
  let sort: any = req.body.sort;
  try {

    let rs = await genericModel.search(db, limit, offset, query, genericType, deleted, sort);
    let rsTotal = await genericModel.searchTotal(db, query, genericType, deleted);
    res.send({ ok: true, rows: rs, total: rsTotal[0].total });
  } catch (error) {
    console.log(error);

    res.send({ ok: false, error: error });
  } finally {
    db.destroy();
  }

}));

router.get('/types', co(async (req, res, next) => {
  let db = req.db;

  try {
    let rs = await genericModel.getTypes(db);
    res.send({ ok: true, rows: rs[0] });
  } catch (error) {
    res.send({ ok: false, error: error });
  } finally {
    db.destroy();
  }

}));

router.get('/search/dc24', co(async (req, res, next) => {
  let db = req.db;
  let q: any = req.query.q;
  try {
    let rs: any = await genericModel.searchDc24(q);
    if (rs.ok) {
      res.send({ ok: true, rows: rs.rows });
    } else {
      res.send({ ok: false, rows: rs.error });
    }
  } catch (error) {
    res.send({ ok: false, error: error });
  } finally {
    db.destroy();
  }

}));


router.get('/uom-req', co(async (req, res, next) => {
  let db = req.db;
  const genericId: any = req.query.genericId
  try {
    let rs = await genericModel.detail(db, genericId);

    if (rs[0]) {
      res.send({ ok: true, rows: rs[0].issue_unit_id });
    } else {
      res.send({ ok: false, rows: rs.error });
    }
  } catch (error) {
    res.send({ ok: false, error: error });
  } finally {
    db.destroy();
  }
}));

router.put('/uom-req', co(async (req, res, next) => {
  let db = req.db;
  const genericId: any = req.body.genericId
  const unitGenericId: any = req.body.unitGenericId
  try {
    let data = {
      issue_unit_id: unitGenericId
    }
    let rs = await genericModel.update(db, genericId, data);

    if (rs) {
      res.send({ ok: true, rows: rs });
    } else {
      res.send({ ok: false, error: 'เกิดข้อผิดผลาด' });
    }
  } catch (error) {
    res.send({ ok: false, error: error });
  } finally {
    db.destroy();
  }
}));

router.get('/generic-type', co(async (req, res, next) => {
  let db = req.db;

  try {
    let rs = await genericModel.getGenericType(db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error });
  } finally {
    db.destroy();
  }

}));

router.post('/', async (req, res, next) => {
  let drugs: any = req.body.drugs;
  let genericCodeAuto = req.decoded.MM_GENERIC_CODE_AUTO === 'Y' ? true : false;
  let genericName = drugs.genericName;
  let genericTypeId = +drugs.genericTypeId;
  // let groupId = drugs.groupId;
  // let dosageId = drugs.dosageId;
  let drugAccountId = drugs.drugAccountId;
  let primaryUnitId = drugs.primaryUnitId;
  let workingCode: any;
  let genericId = moment().format('x');

  let db = req.db;
  if (genericCodeAuto) {
    workingCode = await serialModel.getSerialGenerics(db, genericTypeId);
  } else {
    workingCode = drugs.workingCode;
  }
  if (genericName && genericTypeId) {
    let datas: any = {
      generic_id: genericId,
      generic_name: genericName,
      working_code: workingCode,
      generic_type_id: genericTypeId,
      account_id: drugAccountId,
      primary_unit_id: primaryUnitId
    }


    try {
      await genericModel.save(db, datas);
      res.send({ ok: true, generic_id: genericId });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.send({ ok: false, error: 'ข้อมูลซ้ำ' })
      } else {
        res.send({ ok: false, error: error })
      }
    } finally {
      db.destroy();
    }

  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }

});

router.put('/:genericId', co(async (req, res, next) => {
  let generics: any = req.body.generics;
  let genericId = req.params.genericId;

  let genericName = generics.genericName;
  // let shortName = generics.shortName;
  let genericTypeLV1Id = +generics.genericTypeLV1Id;
  let genericTypeLV2Id = +generics.genericTypeLV2Id;
  let genericTypeLV3Id = +generics.genericTypeLV3Id;
  let typeOldId = +generics.typeOldId;
  let groupEd = generics.groupEd;
  let groupId1 = generics.groupId1;
  let groupId2 = generics.groupId2;
  let groupId3 = generics.groupId3;
  let groupId4 = generics.groupId4;
  let dosageId = generics.dosageId;
  let pTypeId = generics.pTypeId;
  let description = generics.description;
  let keywords = generics.keywords;
  let drugAccountId = generics.drugAccountId;
  let primaryUnitId = generics.primaryUnitId;
  let planningMethod = generics.planningMethod;
  let maxQty = +generics.maxQty;
  let minQty = +generics.minQty;
  let eoqQty = +generics.eoqQty;
  let carryingCost = +generics.carryingCost;
  let orderingCost = +generics.orderingCost;
  let isActive = generics.isActive;
  let isPlanning = generics.isPlanning;
  let purchasingMethod = generics.purchasingMethod;
  let planningUnitGenericId = generics.planningUnitGenericId;
  let workingCode = generics.workingCode;
  let minmaxGroupId = generics.minmaxGroupId
  let db = req.db;

  if (genericId && genericName && genericTypeLV1Id && primaryUnitId) {

    if (genericTypeLV1Id !== typeOldId) {
      workingCode = await serialModel.getSerialGenerics(db, genericTypeLV1Id);
    }

    let datas: any = {
      working_code: workingCode,
      generic_name: genericName,
      generic_type_id: genericTypeLV1Id,
      generic_type_lv2_id: genericTypeLV2Id,
      generic_type_lv3_id: genericTypeLV3Id,
      group_ed: groupEd,
      group_code_1: groupId1,
      group_code_2: groupId2,
      group_code_3: groupId3,
      group_code_4: groupId4,
      dosage_id: dosageId,
      generic_hosp_id: pTypeId,
      description: description,
      keywords: keywords,
      account_id: drugAccountId,
      primary_unit_id: primaryUnitId,
      planning_method: planningMethod,
      max_qty: maxQty,
      min_qty: minQty,
      eoq_qty: eoqQty,
      carrying_cost: carryingCost,
      ordering_cost: orderingCost,
      is_active: isActive,
      is_planning: isPlanning,
      purchasing_method: purchasingMethod,
      planning_unit_generic_id: planningUnitGenericId,
      minmax_group_id: minmaxGroupId
    }

    try {
      await genericModel.update(db, genericId, datas);
      res.send({ ok: true })
    } catch (error) {
      res.send({ ok: false, error: error.message })
    } finally {
      db.destroy();
    }
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
}));

router.get('/detail/:genericId', (req, res, next) => {
  let genericId = req.params.genericId;
  let db = req.db;

  genericModel.detail(db, genericId)
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

router.delete('/', async (req, res, next) => {
  let genericId: any = req.query.genericId;
  let db = req.db;
  try {
    const cr = await genericModel.checkRemove(db, genericId);
    if (cr.length) {
      res.send({ ok: false, error: 'product' });
    } else {
      await genericModel.remove(db, genericId)
        .then((results: any) => {
          res.send({ ok: true });
        })
        .catch((err) => {
          res.send({ ok: false, error: err.message })
        })
    }
  } catch (error) {
    res.send({ ok: false, error: error })
  } finally {
    db.destroy();
  }

});

router.post('/return', async (req, res, next) => {
  let genericId: any = req.body.genericId;
  let db = req.db;
  try {

    await genericModel.return(db, genericId)
      .then((results: any) => {
        res.send({ ok: true });
      })
      .catch((err) => {
        res.send({ ok: false, error: err.message })
      })

  } catch (error) {
    res.send({ ok: false, error: error })
  } finally {
    db.destroy();
  }

});

router.post('/planning/:genericId', co(async (req, res, next) => {
  const db = req.db;
  const minQty: any = req.body.minQty;
  const maxQty: any = req.body.maxQty;
  const genericId = req.params.genericId;
  const warehouseId: any = req.body.warehouseId;
  const minModifier = +req.body.minModifier;
  // const maxModifier = +req.body.maxModifier;
  const primaryUnitId: any = req.body.primaryUnitId;
  const isActive: any = req.body.isActive;
  const sourceWarehouseId: any = req.body.sourceWarehouseId;
  const requisitionQuotaQty: any = req.body.requisitionQuotaQty;

  try {
    const data = {
      generic_id: genericId,
      warehouse_id: warehouseId,
      min_qty: +minQty,
      max_qty: +maxQty,
      is_active: isActive,
      min_modifier_qty: minModifier,
      // max_modifier_qty: maxModifier,
      primary_unit_id: primaryUnitId,
      source_warehouse_id: sourceWarehouseId,
      requisition_quota_qty: requisitionQuotaQty
    }
    await genericModel.savePlanningInventory(db, data);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/expired-alert/:generic_id/:expired', co(async (req, res, next) => {
  const db = req.db;
  let genericId = req.params.generic_id
  let expired = req.params.expired;

  try {
    await genericModel.saveExpiredAlert(db, genericId, expired);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/planning/:genericId', co(async (req, res, next) => {
  const db = req.db;
  const genericId = req.params.genericId;
  try {
    const rows = await genericModel.getPlanningWarehouse(db, genericId);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/planning-detail', co(async (req, res, next) => {
  const db = req.db;
  const warehouseId: any = req.query.warehouseId;

  try {
    const rows = await genericModel.getPlanningByWarehouse(db, warehouseId);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.put('/planning-detail/min', co(async (req, res, next) => {
  const db = req.db;
  const genericPlanningId: any = req.query.genericPlanningId;
  const min_qty: any = req.body.min_qty;

  try {
    const data = {
      min_qty: min_qty
    }
    const rows = await genericModel.updateMinQty(db, genericPlanningId, data);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.put('/planning-detail/max', co(async (req, res, next) => {
  const db = req.db;
  const genericPlanningId: any = req.query.genericPlanningId;
  const max_qty: any = req.body.max_qty;

  try {
    const data = {
      max_qty: max_qty
    }
    const rows = await genericModel.updateMaxQty(db, genericPlanningId, data);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/addall/generic/:warehouseId/:genericTypeId', co(async (req, res, next) => {
  const db = req.db;
  let warehouseId = req.params.warehouseId
  let genericTypeId = req.params.genericTypeId;

  try {
    await genericModel.addAllGenericPlanning(db, warehouseId, genericTypeId);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/add/generics/warehouse', co(async (req, res, next) => {
  const db = req.db;
  let srcWarehouseId: any = req.query.srcWarehouseId
  let dstWarehouseId: any = req.query.dstWarehouseId

  try {
    await genericModel.removePlanningInventroybyWarehouse(db, srcWarehouseId);
    await genericModel.addGenericByWarehouse(db, dstWarehouseId, srcWarehouseId);

    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.post('/add/generics', co(async (req, res, next) => {
  const db = req.db;
  let warehouseId: any = req.body.warehouseId
  let data: any = req.body.data;

  try {
    const _data = {
      warehouse_id: warehouseId,
      generic_id: data.generic_id,
      primary_unit_id: data.primary_unit_id,
      min_qty: data.min_qty,
      max_qty: data.max_qty
    }

    await genericModel.savePlanningInventory(db, _data);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.put('/planning/:genericPlanningId', co(async (req, res, next) => {
  const db = req.db;
  const minQty = +req.body.minQty;
  const maxQty = +req.body.maxQty;
  const genericPlanningId = req.params.genericPlanningId;
  const unitId: any = req.body.unitId;
  const minModifier: any = req.body.minModifier;
  const primaryUnitId: any = req.body.primaryUnitId;
  const sourceWarehouseId: any = req.body.sourceWarehouseId;
  const isActive: any = req.body.isActive;
  const requisitionQuotaQty = +req.body.requisitionQuotaQty;

  try {
    const data = {
      min_qty: +minQty,
      max_qty: +maxQty,
      min_modifier_qty: +minModifier,
      primary_unit_id: primaryUnitId,
      is_active: isActive,
      source_warehouse_id: sourceWarehouseId,
      requisition_quota_qty: requisitionQuotaQty
    }
    await genericModel.updatePlanningInventory(db, genericPlanningId, data);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.delete('/planning/:genericPlanningId', co(async (req, res, next) => {
  const db = req.db;
  const genericPlanningId = req.params.genericPlanningId;
  try {
    await genericModel.removePlanningInventroy(db, genericPlanningId);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.delete('/delete/generic/planning/:warehouseId', co(async (req, res, next) => {
  const db = req.db;
  const warehouseId = req.params.warehouseId;
  try {
    await genericModel.removePlanningInventroybyWarehouse(db, warehouseId);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.delete('/delete/generic/planning/id/:genericPlanningId', co(async (req, res, next) => {
  const db = req.db;
  const genericPlanningId = req.params.genericPlanningId;
  try {
    await genericModel.removePlanningInventroybyGenericPlanningId(db, genericPlanningId);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/search-autocomplete', async (req, res, next) => {

  const db = req.db;
  let query: any = req.query2.q;
  let generic_type_id = req.decoded.generic_type_id;
  let gids = [];
  let types = req.decoded.generic_type_id.split(',');
  types.forEach(v => {
    gids.push(v);
  });
  try {
    let rs: any = await genericModel.searchAutoComplete(db, query, gids);
    if (rs[0].length) {
      res.send(rs[0]);
    } else {
      res.send([])
    }
  } catch (error) {
    res.send({ ok: false, error: error });
  } finally {
    db.destroy();
  }
});

export default router;
