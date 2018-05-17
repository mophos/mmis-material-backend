import Knex = require('knex');
import * as moment from 'moment';
export class ProductModel {
  list(knex: Knex, limit: number, offset: number, groupId: any) {
    return knex('mm_products as p')
      .select('p.*', 'g.working_code as generic_working_code', 'g.generic_name', 'lm.labeler_name as m_labeler',
        'lv.labeler_name as v_labeler', 'u.unit_name as primary_unit_name')
      .leftJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .leftJoin('mm_labelers as lm', 'lm.labeler_id', 'p.m_labeler_id')
      .leftJoin('mm_labelers as lv', 'lv.labeler_id', 'p.v_labeler_id')
      .leftJoin('mm_units as u', 'u.unit_id', 'p.primary_unit_id')
      .where('p.mark_deleted', 'N')
      .whereIn('g.generic_type_id', groupId)
      .orderBy('p.product_name')
      .limit(limit)
      .offset(offset);
  }

  listAll(knex: Knex, limit: number, offset: number) {
    return knex('mm_products as p')
      .select('p.*', 'g.working_code as generic_working_code', 'g.generic_name', 'lm.labeler_name as m_labeler',
        'lv.labeler_name as v_labeler', 'u.unit_name as primary_unit_name')
      .leftJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .leftJoin('mm_labelers as lm', 'lm.labeler_id', 'p.m_labeler_id')
      .leftJoin('mm_labelers as lv', 'lv.labeler_id', 'p.v_labeler_id')
      .leftJoin('mm_units as u', 'u.unit_id', 'p.primary_unit_id')
      .where('p.mark_deleted', 'N')
      .orderBy('p.product_name')
      .limit(limit)
      .offset(offset);
  }

  totalProducts(knex: Knex, groupId: any) {
    return knex('mm_products as p')
      .count('* as total')
      .leftJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .whereIn('g.generic_type_id', groupId)
      .where('p.mark_deleted', 'N');
  }

  totalAllProducts(knex: Knex) {
    return knex('mm_products')
      .count('* as total')
      .where('mark_deleted', 'N');
  }

  search(knex: Knex, query: any, limit: number, offset: number, groupId: any) {
    const _query = `%${query}%`;
    return knex('mm_products as p')
      .select('p.*', 'g.generic_name', 'g.working_code as generic_working_code', 'lm.labeler_name as m_labeler',
        'lv.labeler_name as v_labeler', 'u.unit_name as primary_unit_name')
      .innerJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .leftJoin('mm_labelers as lm', 'lm.labeler_id', 'p.m_labeler_id')
      .leftJoin('mm_labelers as lv', 'lv.labeler_id', 'p.v_labeler_id')
      .leftJoin('mm_units as u', 'u.unit_id', 'p.primary_unit_id')
      .where(w => {
        w.where('p.product_name', 'like', _query)
          .orWhere('g.generic_name', 'like', _query)
          .orWhere('p.working_code', query)
          .orWhere('p.keywords', 'like', _query)
      })
      .where('p.mark_deleted', 'N')
      .whereIn('g.generic_type_id', groupId)
      .orderBy('p.product_name')
      .limit(limit)
      .offset(offset);
  }

  searchAll(knex: Knex, query: any, limit: number, offset: number) {
    const _query = `%${query}%`;
    return knex('mm_products as p')
      .select('p.*', 'g.generic_name', 'g.working_code as generic_working_code', 'lm.labeler_name as m_labeler',
        'lv.labeler_name as v_labeler', 'u.unit_name as primary_unit_name')
      .innerJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .leftJoin('mm_labelers as lm', 'lm.labeler_id', 'p.m_labeler_id')
      .leftJoin('mm_labelers as lv', 'lv.labeler_id', 'p.v_labeler_id')
      .leftJoin('mm_units as u', 'u.unit_id', 'p.primary_unit_id')
      .where(w => {
        w.where('p.product_name', 'like', _query)
          .orWhere('g.generic_name', 'like', _query)
          .orWhere('p.keywords', 'like', _query)
          .orWhere('p.working_code', query)
      })
      .where('p.mark_deleted', 'N')
      .orderBy('p.product_name')
      .limit(limit)
      .offset(offset);
  }

  searchTotal(knex: Knex, query: any, groupId: any) {
    const _query = `%${query}%`;
    return knex('mm_products as p')
      .count('* as total')
      .innerJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .where(w => {
        w.where('p.product_name', 'like', _query)
          .orWhere('g.generic_name', 'like', _query)
          .orWhere('p.working_code', query)
          .orWhere('p.keywords', 'like', _query)
      })
      .whereIn('product_group_id', groupId)
      .where('p.mark_deleted','N');
  }

  searchAllTotal(knex: Knex, query: any) {
    const _query = `%${query}%`;
    return knex('mm_products as p')
      .count('* as total')
      .innerJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .where(w => {
        w.where('p.product_name', 'like', _query)
          .orWhere('g.generic_name', 'like', _query)
          .orWhere('p.working_code', query)
          .orWhere('p.keywords', 'like', _query)
      })
      .where('p.mark_deleted','N');
  }

  getProductGroups(knex: Knex, datas: any) {
    return knex('mm_generic_types')
      .orderBy('generic_type_name')
  }

  getProductPrimaryUnit(knex: Knex, productId: any) {
    return knex('mm_products as p')
      .select('p.primary_unit_id', 'u.unit_name')
      .leftJoin('mm_units as u', 'u.unit_id', 'p.primary_unit_id')
      .where('p.product_id', productId)

  }

  save(knex: Knex, datas: any) {
    return knex('mm_products')
      .insert(datas);
  }

  saveProductPackages(knex: Knex, datas: any) {
    return knex('mm_product_package')
      .insert(datas);
  }

  removeProductPackages(knex: Knex, productId: string) {
    return knex('mm_product_package')
      .where('product_id', productId)
      .del();
  }

  saveProductLabeler(knex: Knex, datas: any) {
    return knex('mm_product_labeler')
      .insert(datas);
  }

  removeProductLabeler(knex: Knex, productId: string) {
    return knex('mm_product_labeler')
      .where('product_id', productId)
      .del();
  }

  saveProductGeneric(knex: Knex, datas: any) {
    return knex('mm_generic_product')
      .insert(datas);
  }

  updateProductGeneric(knex: Knex, productId: string, genericId: string) {
    return knex('mm_generic_product')
      .where('product_id', productId)
      .update({
        generic_id: genericId
      });
  }

  removeProductGeneric(knex: Knex, productId: string) {
    return knex('mm_generic_product')
      .where('product_id', productId)
      .del();
  }

  update(knex: Knex, productId: string, datas: any) {
    return knex('mm_products')
      .where('product_id', productId)
      .update(datas);
  }

  detail(knex: Knex, productId: string) {
    return knex('mm_products as p')
      .select('p.*', 'g.generic_name', 'lm.labeler_name as m_labeler',
        'lv.labeler_name as v_labeler')
      .leftJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .leftJoin('mm_labelers as lm', 'lm.labeler_id', 'p.m_labeler_id')
      .leftJoin('mm_labelers as lv', 'lv.labeler_id', 'p.v_labeler_id')
      .where('p.product_id', productId);
  }

  remove(knex: Knex, productId: string) {
    return knex('mm_products')
      .where('product_id', productId)
      .update('mark_deleted','Y')
  }

  searchGeneric(knex: Knex, query: string) {
    const _query = `%${query}%`;
    let sql = `
    select g.generic_id, g.generic_name, g.working_code
    from mm_generics as g
    where g.is_active='Y'
    and (g.generic_name like ? or g.working_code like ?)
    limit 20
    `;

    return knex.raw(sql, [_query, _query]);
  }

  // planning

  savePlanningInventory(knex: Knex, data: any) {
    return knex('mm_product_planning')
      .insert(data);
  }

  getPlanningWarehouse(knex: Knex, productId: any) {
    return knex('mm_product_planning as pp')
      .select('pp.*', 'u.unit_name', 'u.unit_code', 'w.warehouse_name', 'ws.warehouse_name as source_warehouse_name')
      .leftJoin('mm_units as u', 'u.unit_id', 'pp.primary_unit_id')
      .leftJoin('wm_warehouses as w', 'w.warehouse_id', 'pp.warehouse_id')
      .leftJoin('wm_warehouses as ws', 'ws.warehouse_id', 'pp.source_warehouse_id')
      .where('pp.product_id', productId);
  }

  updatePlanningInventory(knex: Knex, productPlanningId: any, data: any) {
    return knex('mm_product_planning')
      .where('product_planning_id', productPlanningId)
      .update(data)
  }

  removePlanningInventroy(knex: Knex, productPlanningId: any) {
    return knex('mm_product_planning')
      .where('product_planning_id', productPlanningId)
      .del();
  }

  markDeleted(knex: Knex, productId: any) {
    return knex('mm_products')
      .update({ mark_deleted: 'Y' })
      .where('product_id', productId);
  }

  getProductGroupList(knex: Knex) {
    return knex('mm_generic_types');
  }

  setWorkingCode(knex: Knex, productId: any, workingCode: any) {
    return knex('mm_products')
      .update({
        working_code: workingCode
      })
      .where('product_id', productId);
  }
  getWorkingCode(knex: Knex, genericId: any) {
    return knex('mm_generics as mg').select('mg.working_code')
      .select(knex.raw('count(*) as count'))
      .join('mm_products as mp', 'mg.generic_id', 'mp.generic_id')
      .where('mg.generic_id', genericId)
  }

}