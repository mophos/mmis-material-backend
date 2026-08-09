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
  let groupId: any = req.body.groupId;
  let sort: any = req.body.sort;

  if (typeof groupId === 'string') {
    groupId = [groupId];
  }

  try {
    if (groupId) {
      let rsTotal = await productModel.totalProducts(db, groupId);
      const resp = await productModel.list(db, limit, offset, groupId, sort);
      res.send({ ok: true, rows: resp, total: rsTotal[0].total });
    } else {
      let rsTotal = await productModel.totalAllProducts(db);
      const resp = await productModel.listAll(db, limit, offset, sort);
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
  const query: any = req.body.query;
  const limit = +req.body.limit || 15;
  const offset = +req.body.offset || 0;
  let genericType: any = req.body.genericType;
  let deleted: any = req.body.deleted;
  let sort: any = req.body.sort;
  try {

    const respTotal = await productModel.searchTotal(db, query, genericType, deleted);
    const resp = await productModel.search(db, query, limit, offset, genericType, deleted, sort);
    res.send({ ok: true, rows: resp, total: respTotal[0].total });
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
    console.log(rs);

    if (rs[0].qty > 0) {
      res.send({ ok: false, error: 'ไม่สามารถลบรายการได้ เนื่องจากมียอดคงเหลือ หรือยอดจอง' });
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

router.delete('/return-deleted/:productId', warp(async (req, res, next) => {

  let db = req.db;
  const productId = req.params.productId;

  try {
    let rs: any = await productModel.checkReturnDeleted(db, productId)
    console.log(rs[0]);

    if (rs[0].mark_deleted == 'N' && rs[0].is_active == 'Y') {
      await productModel.returnDeleted(db, productId);
      res.send({ ok: true });
    } else {
      res.send({ ok: false, error: 'ไม่สามารถเรียกคืนได้เนื่องจาก ' + rs[0].working_code + '-' + rs[0].generic_name + ' ถูกลบหรือปิดใช้งานอยู่' });
    }

  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }

}));

router.get('/search-generic', warp(async (req, res, next) => {

  let db = req.db;
  let query: any = req.query.query;
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
  const productName: any = req.body.productName;
  const primaryUnitId: any = req.body.primaryUnitId;
  const genericId: any = req.body.genericId;
  const mLabelerId: any = req.body.mLabelerId;
  const vLabelerId: any = req.body.vLabelerId;

  const db = req.db;
  let workingCode;
  let rsWorkingCode = await productModel.getWorkingCode(db, genericId);
  // console.log('1',workingCodeRuning);

  let workingCodeRuning = '' + (+rsWorkingCode[0].count + 1)
  console.log(workingCodeRuning);

  while (workingCodeRuning.length < 3) {
    // console.log('length-', workingCodeRuning.length);
    workingCodeRuning = '0' + workingCodeRuning;
    // console.log('string', workingCodeRuning);
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

  const productName: any = req.body.productName;
  const isRawMaterial: any = req.body.isRawMaterial;
  const genericId: any = req.body.selectedGenericId;
  const mLabelerId: any = req.body.mLabelerId;
  const vLabelerId: any = req.body.vLabelerId;
  const pickingRuleId: any = req.body.pickingRuleId;
  const isActive: any = req.body.isActive;
  const isLotControl: any = req.body.isLotControl;
  const isExpiredControl: any = req.body.isExpiredControl;
  const description: any = req.body.description;
  const purchaseUnitId: any = req.body.purchaseUnitId;
  const issueUnitId: any = req.body.issueUnitId;
  const primaryUnitId: any = req.body.primaryUnitId;
  // const workingCode: any = req.body.workingCode;
  const purchasePrice: any = req.body.purchasePrice;
  // const productGroupId: any = req.body.productGroupId;
  const keywords: any = req.body.keywords;
  // const standardCost: any = req.body.standardCost;
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
      is_expired_control: isExpiredControl,
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
}));

router.put('/:productId', warp(async (req, res, next) => {
  const db = req.db;

  let productId = req.params.productId;

  let productName: any = req.body.productName;
  let isRawMaterial: any = req.body.isRawMaterial;
  let genericId: any = req.body.selectedGenericId;
  let mLabelerId: any = req.body.mLabelerId;
  let vLabelerId: any = req.body.vLabelerId;
  let pickingRuleId: any = req.body.pickingRuleId;
  let isActive: any = req.body.isActive;
  let isLotControl: any = req.body.isLotControl;
  let isExpiredControl: any = req.body.isExpiredControl;
  let description: any = req.body.description;
  let purchaseUnitId: any = req.body.purchaseUnitId;
  let issueUnitId: any = req.body.issueUnitId;
  let primaryUnitId: any = req.body.primaryUnitId;
  // let workingCode: any = req.body.workingCode;
  let reg_no: any = req.body.reg_no;
  let purchasePrice: any = req.body.purchasePrice;
  let keywords: any = req.body.keywords;
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
      is_expired_control: isExpiredControl,
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
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
  const minQty: any = req.body.minQty;
  const maxQty: any = req.body.maxQty;
  const productId = req.params.productId;
  const warehouseId: any = req.body.warehouseId;
  const minModifier = +req.body.minModifier;
  // const maxModifier = +req.body.maxModifier;
  const primaryUnitId: any = req.body.primaryUnitId;
  const isActive: any = req.body.isActive;
  const sourceWarehouseId: any = req.body.sourceWarehouseId;
  const requisitionQuotaQty: any = req.body.requisitionQuotaQty;

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
  const unitId: any = req.body.unitId;
  const minModifier: any = req.body.minModifier;
  // const maxModifier: any = req.body.maxModifier;
  const primaryUnitId: any = req.body.primaryUnitId;
  const sourceWarehouseId: any = req.body.sourceWarehouseId;
  const isActive: any = req.body.isActive;
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
