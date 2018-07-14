import { ProductModel } from './../models/product';
'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { unitOfTime } from 'moment';
import * as warp from 'co-express';

import { SerialModel } from '../models/serial';
const router = express.Router();

const productModel = new ProductModel();
const serialModel = new SerialModel();

router.post('/', warp(async (req, res, next) => {

  let db = req.db;
  let limit = +req.body.limit || 15;
  let offset = +req.body.offset || 0;
  let groupId = req.body.groupId;

  if (typeof groupId === 'string') {
    groupId = [groupId];
  }

  try {
    if (groupId) {
      let rsTotal = await productModel.totalProducts(db, groupId);
      const resp = await productModel.list(db, limit, offset, groupId);
      res.send({ ok: true, rows: resp, total: rsTotal[0].total });
    } else {
      let rsTotal = await productModel.totalAllProducts(db);
      const resp = await productModel.listAll(db, limit, offset);
      res.send({ ok: true, rows: resp, total: rsTotal[0].total });
    }

  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

router.post('/search', warp(async (req, res, next) => {

  let db = req.db;
  const query = req.body.query;
  const limit = +req.body.limit || 15;
  const offset = +req.body.offset || 0;
  let groupId = req.body.groupId;
  if (typeof groupId === 'string') {
    groupId = [groupId];
  }
  try {
    if (groupId) {
      const respTotal = await productModel.searchTotal(db, query, groupId);
      const resp = await productModel.search(db, query, limit, offset, groupId);
      res.send({ ok: true, rows: resp, total: respTotal[0].total });
    } else {
      const respTotal = await productModel.searchAllTotal(db, query);
      const resp = await productModel.searchAll(db, query, limit, offset);
      res.send({ ok: true, rows: resp, total: respTotal[0].total });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

router.delete('/mark-deleted/:productId', warp(async (req, res, next) => {

  let db = req.db;
  const productId = req.params.productId;

  try {
    const rs = await productModel.checkQtyForMarkDeleted(db, productId);
    if (rs[0].qty > 0) {
      res.send({ ok: false, error: 'ไม่สามารถลบรายการได้ เนื่องจากมียอดคงเหลือ หรือยอดจอง' }) ;
    } else {
      await productModel.markDeleted(db, productId);
      res.send({ ok: true });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

router.get('/search-generic', warp(async (req, res, next) => {

  let db = req.db;
  let query = req.query.query;
  try {
    const resp = await productModel.searchGeneric(db, query);
    res.send(resp[0]);
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

router.post('/generate-workingcode', async (req, res, next) => {
  let db = req.db;
  let productId: any = req.body.productId;
  let typeId: any = +req.body.typeId;

  if (typeId && productId) {
    try {
      let srType = null;

      if (typeId === 1) { // ยา
        srType = 'WCA';
      } else if (typeId === 2) { //ไม่ใช่ยา
        srType = 'WCC'
      } else if (typeId === 3) { // เคมีภัณฑ์
        srType = 'WCB'
      } else if (typeId === 4) { // วัสดุวิทยาศาสตร์และการแพทย์
        srType = 'WCE'
      } else if (typeId === 5) { // ยาผลิต
        srType = 'WCD'
      } else if (typeId === 10) { // อื่นๆ
        srType = 'WCF'
      } else { // ยา
        srType = 'WCA'
      }

      let workingCode = await serialModel.getSerial(db, srType);

      await productModel.setWorkingCode(db, productId, workingCode);
      res.send({ ok: true, workingCode: workingCode });
    } catch (error) {
      res.send({ ok: false, error: error.message });
    } finally {
      db.destroy();
    }
  } else {
    res.send({ ok: false, error: 'กรุณาระบุ Product Id และ Type Id' });
  }

});

router.post('/fast-save', warp(async (req, res, next) => {
  const productName = req.body.productName;
  const primaryUnitId = req.body.primaryUnitId;
  const genericId = req.body.genericId;
  const mLabelerId = req.body.mLabelerId;
  const vLabelerId = req.body.vLabelerId;

  const db = req.db;
  let workingCode;
  let rsWorkingCode = await productModel.getWorkingCode(db, genericId);
  // console.log('1',workingCodeRuning);

  let workingCodeRuning = '' + rsWorkingCode[0].count + 1
  console.log(workingCodeRuning);

  console.log('length', workingCodeRuning.length);
  while (workingCodeRuning.length < 3) {
    console.log('length-', workingCodeRuning.length);
    workingCodeRuning = '0' + workingCodeRuning;
    console.log('string', workingCodeRuning);
  }

  workingCode = rsWorkingCode[0].working_code + workingCodeRuning;
  console.log(workingCode);
  if (productName && primaryUnitId && genericId && mLabelerId && vLabelerId) {
    try {
      const datas = {
        product_name: productName,
        product_id: moment().format('x'),
        generic_id: genericId,
        m_labeler_id: mLabelerId,
        v_labeler_id: vLabelerId,
        primary_unit_id: primaryUnitId,
        working_code: workingCode
      };

      await productModel.save(db, datas);
      res.send({ ok: true, productId: datas.product_id });
    } catch (error) {
      res.send({ ok: false, error: error.message });
    } finally {
      db.destroy();
    }
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่ครบถ้วน' })
  }

}));

router.post('/', warp(async (req, res, next) => {

  const productName = req.body.productName;
  const isRawMaterial = req.body.isRawMaterial;
  const genericId = req.body.selectedGenericId;
  const mLabelerId = req.body.mLabelerId;
  const vLabelerId = req.body.vLabelerId;
  const pickingRuleId = req.body.pickingRuleId;
  const isActive = req.body.isActive;
  const isLotControl = req.body.isLotControl;
  const description = req.body.description;
  const purchaseUnitId = req.body.purchaseUnitId;
  const issueUnitId = req.body.issueUnitId;
  const primaryUnitId = req.body.primaryUnitId;
  // const workingCode = req.body.workingCode;
  const purchasePrice = req.body.purchasePrice;
  // const productGroupId = req.body.productGroupId;
  const keywords = req.body.keywords;
  // const standardCost = req.body.standardCost;
  const db = req.db;

  if (productName && mLabelerId && vLabelerId && genericId) {
    let datas: any = {
      product_name: productName,
      is_raw_material: isRawMaterial,
      generic_id: genericId,
      m_labeler_id: mLabelerId,
      v_labeler_id: vLabelerId,
      picking_rule_id: pickingRuleId,
      is_active: isActive,
      is_lot_control: isLotControl,
      description: description,
      purchase_unit_id: purchaseUnitId,
      purchase_cost: purchasePrice,
      issue_unit_id: issueUnitId,
      primary_unit_id: primaryUnitId,
      keywords: keywords,
      // product_group_id: productGroupId,
      // standard_cost: +standardCost
    }

    try {
      await productModel.save(db, datas);
      res.send({ ok: true });
    } catch (error) {
      res.send({ ok: false, error: error.message });
    } finally {
      db.destroy();
    }

  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' }) ;
  }
}));

router.put('/:productId', warp(async (req, res, next) => {
  const db = req.db;

  let productId = req.params.productId;

  let productName = req.body.productName;
  let isRawMaterial = req.body.isRawMaterial;
  let genericId = req.body.selectedGenericId;
  let mLabelerId = req.body.mLabelerId;
  let vLabelerId = req.body.vLabelerId;
  let pickingRuleId = req.body.pickingRuleId;
  let isActive = req.body.isActive;
  let isLotControl = req.body.isLotControl;
  let description = req.body.description;
  let purchaseUnitId = req.body.purchaseUnitId;
  let issueUnitId = req.body.issueUnitId;
  let primaryUnitId = req.body.primaryUnitId;
  // let workingCode = req.body.workingCode;
  let reg_no = req.body.reg_no;
  let purchasePrice = req.body.purchasePrice;
  let keywords = req.body.keywords;
  let productGroupId = +req.body.productGroupId;
  // let productGroupOldId = +req.body.productGroupOldId;

  // if (!workingCode) {
  //   let srType = null;

  //   if (productGroupId === 1) { // ยา
  //     srType = 'PDA';
  //   } else if (productGroupId === 2) { //ไม่ใช่ยา
  //     srType = 'PDC'
  //   } else if (productGroupId === 3) { // เคมีภัณฑ์
  //     srType = 'PDB'
  //   } else if (productGroupId === 4) { // วัสดุวิทยาศาสตร์และการแพทย์
  //     srType = 'PDE'
  //   } else if (productGroupId === 5) { // ยาผลิต
  //     srType = 'PDD'
  //   } else if (productGroupId === 10) { // อื่นๆ
  //     srType = 'PDF'
  //   }else { // ยา
  //     srType = 'PDA'
  // //   }

  // //   workingCode = await serialModel.getSerial(db, srType);

  // } else if (productGroupId !== productGroupOldId) {
  //   let srType = null;

  //   if (productGroupId === 1) { // ยา
  //     srType = 'PDA';
  //   } else if (productGroupId === 2) { //ไม่ใช่ยา
  //     srType = 'PDC'
  //   } else if (productGroupId === 3) { // เคมีภัณฑ์
  //     srType = 'PDB'
  //   } else if (productGroupId === 4) { // วัสดุวิทยาศาสตร์และการแพทย์
  //     srType = 'PDE'
  //   } else if (productGroupId === 5) { // ยาผลิต
  //     srType = 'PDD'
  //   } else if (productGroupId === 10) { // อื่นๆ
  //     srType = 'PDF'
  //   } else { // ยา
  //     srType = 'PDA'
  //   }

  //   workingCode = await serialModel.getSerial(db, srType);
  // }

  if (productName && productId && mLabelerId && vLabelerId && genericId) {
    let datas: any = {
      product_name: productName,
      is_raw_material: isRawMaterial,
      generic_id: genericId,
      m_labeler_id: mLabelerId,
      v_labeler_id: vLabelerId,
      picking_rule_id: pickingRuleId,
      is_active: isActive,
      is_lot_control: isLotControl,
      description: description,
      purchase_unit_id: purchaseUnitId,
      purchase_cost: purchasePrice,
      issue_unit_id: issueUnitId,
      primary_unit_id: primaryUnitId,
      // working_code: workingCode,
      reg_no: reg_no,
      keywords: keywords,
      product_group_id: productGroupId,
      // min_qty: minQty,
      // max_qty: maxQty,
      // planning_method: planningMethod,
      // eoq_qty: eoqQty,
      // carrying_cost: carryingCost,
      // ordering_cost: orderingCost,
      // standard_cost: +standardCost
    }

    try {
      await productModel.update(db, productId, datas);
      res.send({ ok: true });
    } catch (error) {
      res.send({ ok: false, error: error.message });
    } finally {
      db.destroy();
    }

  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' }) ;
  }
}));

router.get('/detail/:productId', warp(async (req, res, next) => {
  let productId = req.params.productId;
  let db = req.db;

  try {
    const rs = await productModel.detail(db, productId);
    res.send({ ok: true, detail: rs[0] });
  } catch (error) {
    res.send({ ok: false, error: error });
  } finally {
    db.destroy();
  }

}));

router.delete('/:productId', warp(async (req, res, next) => {
  let productId = req.params.productId;
  let db = req.db;

  try {
    await productModel.remove(db, productId);
    await productModel.removeProductLabeler(db, productId);
    await productModel.removeProductPackages(db, productId);
    await productModel.removeProductGeneric(db, productId);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

// planning

router.post('/planning/:productId', warp(async (req, res, next) => {
  const db = req.db;
  const minQty = req.body.minQty;
  const maxQty = req.body.maxQty;
  const productId = req.params.productId;
  const warehouseId = req.body.warehouseId;
  const minModifier = +req.body.minModifier;
  // const maxModifier = +req.body.maxModifier;
  const primaryUnitId = req.body.primaryUnitId;
  const isActive = req.body.isActive;
  const sourceWarehouseId = req.body.sourceWarehouseId;
  const requisitionQuotaQty = req.body.requisitionQuotaQty;

  try {
    const data = {
      product_id: productId,
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
    await productModel.savePlanningInventory(db, data);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/planning/:productId', warp(async (req, res, next) => {
  const db = req.db;
  const productId = req.params.productId;
  try {
    const rows = await productModel.getPlanningWarehouse(db, productId);
    res.send({ ok: true, rows: rows });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.put('/planning/:productPlanningId', warp(async (req, res, next) => {
  const db = req.db;
  const minQty = +req.body.minQty;
  const maxQty = +req.body.maxQty;
  const productPlanningId = req.params.productPlanningId;
  const unitId = req.body.unitId;
  const minModifier = req.body.minModifier;
  // const maxModifier = req.body.maxModifier;
  const primaryUnitId = req.body.primaryUnitId;
  const sourceWarehouseId = req.body.sourceWarehouseId;
  const isActive = req.body.isActive;
  const requisitionQuotaQty = +req.body.requisitionQuotaQty;

  try {
    const data = {
      min_qty: +minQty,
      max_qty: +maxQty,
      min_modifier_qty: +minModifier,
      // max_modifier_qty: +maxModifier,
      primary_unit_id: primaryUnitId,
      is_active: isActive,
      source_warehouse_id: sourceWarehouseId,
      requisition_quota_qty: requisitionQuotaQty
    }
    await productModel.updatePlanningInventory(db, productPlanningId, data);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.delete('/planning/:productPlanningId', warp(async (req, res, next) => {
  const db = req.db;
  const productPlanningId = req.params.productPlanningId;
  try {
    await productModel.removePlanningInventroy(db, productPlanningId);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

router.get('/product-groups-list', warp(async (req, res, next) => {
  const db = req.db;

  try {
    let rs = await productModel.getProductGroupList(db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message })
  } finally {
    db.destroy();
  }
}));

export default router;
