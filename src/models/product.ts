import Knex = require('knex');
import * as moment from 'moment';
import { WSAEDQUOT } from 'constants';
export class ProductModel {
  list(knex: Knex, limit: number, offset: number, groupId: any, sort: any) {
    let sql = knex('mm_products as p')
      .select('p.*', 'g.working_code as generic_working_code', 'g.generic_name', 'lm.labeler_name as m_labeler',
        'lv.labeler_name as v_labeler', 'u.unit_name as primary_unit_name')
      .leftJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .leftJoin('mm_labelers as lm', 'lm.labeler_id', 'p.m_labeler_id')
      .leftJoin('mm_labelers as lv', 'lv.labeler_id', 'p.v_labeler_id')
      .leftJoin('mm_units as u', 'u.unit_id', 'p.primary_unit_id')
      .where('p.mark_deleted', 'N')
      .whereIn('g.generic_type_id', groupId)
    if (sort.by) {
      let reverse = sort.reverse ? 'DESC' : 'ASC';
      if (sort.by === 'product_name') {
        // sql += ` order by pc.purchase_order_number ${reverse} `;
        sql.orderBy('p.product_name', reverse)
      } else if (sort.by === 'generic_name') {
        sql.orderBy('g.generic_name', reverse)
      } else if (sort.by === 'primary_unit_name') {
        sql.orderBy('u.unit_name', reverse)
      } else if (sort.by === 'm_labeler') {
        sql.orderBy('lm.labeler_name', reverse)
      } else if (sort.by === 'v_labeler') {
        sql.orderBy('lv.labeler_name', reverse)
      }
    } else {
      sql.orderBy('p.product_name')
    }
    sql.limit(limit)
      .offset(offset);
    return sql;
  }

  listAll(knex: Knex, limit: number, offset: number, sort: any) {
    let sql = knex('mm_products as p')
      .select('p.*', 'g.working_code as generic_working_code', 'g.generic_name', 'lm.labeler_name as m_labeler',
        'lv.labeler_name as v_labeler', 'u.unit_name as primary_unit_name')
      .leftJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .leftJoin('mm_labelers as lm', 'lm.labeler_id', 'p.m_labeler_id')
      .leftJoin('mm_labelers as lv', 'lv.labeler_id', 'p.v_labeler_id')
      .leftJoin('mm_units as u', 'u.unit_id', 'p.primary_unit_id')
      .where('p.mark_deleted', 'N')
    if (sort.by) {
      let reverse = sort.reverse ? 'DESC' : 'ASC';
      if (sort.by === 'product_name') {
        // sql += ` order by pc.purchase_order_number ${reverse} `;
        sql.orderBy('p.product_name', reverse)
      } else if (sort.by === 'generic_name') {
        sql.orderBy('g.generic_name', reverse)
      } else if (sort.by === 'primary_unit_name') {
        sql.orderBy('u.unit_name', reverse)
      } else if (sort.by === 'm_labeler') {
        sql.orderBy('lm.labeler_name', reverse)
      } else if (sort.by === 'v_labeler') {
        sql.orderBy('lv.labeler_name', reverse)
      }
    } else {
      sql.orderBy('p.product_name')
    }
    sql.limit(limit)
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

  search(knex: Knex, query: any, limit: number, offset: number, groupId: any, deleted: any, sort: any) {
    const _query = `%${query}%`;
    let sql = knex('mm_products as p')
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
    if (!deleted) {
      sql.where('p.mark_deleted', 'N')
    }
    sql.whereIn('g.generic_type_id', groupId)
    if (sort.by) {
      let reverse = sort.reverse ? 'DESC' : 'ASC';
      if (sort.by === 'product_name') {
        sql.orderBy('p.product_name', reverse)
      } else if (sort.by === 'generic_name') {
        sql.orderBy('g.generic_name', reverse)
      } else if (sort.by === 'primary_unit_name') {
        sql.orderBy('u.unit_name', reverse)
      } else if (sort.by === 'm_labeler') {
        sql.orderBy('lm.labeler_name', reverse)
      } else if (sort.by === 'v_labeler') {
        sql.orderBy('lv.labeler_name', reverse)
      }
    } else {
      sql.orderBy('p.product_name')
    }
    sql.limit(limit)
      .offset(offset);
    return sql;
  }

  searchAll(knex: Knex, query: any, limit: number, offset: number, deleted: any, sort: any) {
    const _query = `%${query}%`;
    let sql = knex('mm_products as p')
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
    if (!deleted) {
      sql.where('p.mark_deleted', 'N')
    }
    if (sort.by) {
      let reverse = sort.reverse ? 'DESC' : 'ASC';
      if (sort.by === 'product_name') {
        sql.orderBy('p.product_name', reverse)
      } else if (sort.by === 'generic_name') {
        sql.orderBy('g.generic_name', reverse)
      } else if (sort.by === 'primary_unit_name') {
        sql.orderBy('u.unit_name', reverse)
      } else if (sort.by === 'm_labeler') {
        sql.orderBy('lm.labeler_name', reverse)
      } else if (sort.by === 'v_labeler') {
        sql.orderBy('lv.labeler_name', reverse)
      }
    } else {
      sql.orderBy('p.product_name')
    }
    sql.limit(limit)
      .offset(offset);
    return sql;
  }

  searchTotal(knex: Knex, query: any, groupId: any, deleted: any) {
    const _query = `%${query}%`;
    let sql = knex('mm_products as p')
      .count('* as total')
      .innerJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .where(w => {
        w.where('p.product_name', 'like', _query)
          .orWhere('g.generic_name', 'like', _query)
          .orWhere('p.working_code', query)
          .orWhere('p.keywords', 'like', _query)
      })
      .whereIn('product_group_id', groupId);
    if (!deleted) {
      sql.where('p.mark_deleted', 'N')
    }
    return sql;
  }

  searchAllTotal(knex: Knex, query: any, deleted) {
    const _query = `%${query}%`;
    let sql = knex('mm_products as p')
      .count('* as total')
      .innerJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .where(w => {
        w.where('p.product_name', 'like', _query)
          .orWhere('g.generic_name', 'like', _query)
          .orWhere('p.working_code', query)
          .orWhere('p.keywords', 'like', _query)
      })
    if (!deleted) {
      sql.where('p.mark_deleted', 'N')
    }
    return sql;
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
      .select('p.*', 'g.generic_name', 'g.working_code as generic_code', 'lm.labeler_name as m_labeler',
        'lv.labeler_name as v_labeler', 'pg.product_group_name')
      .leftJoin('mm_generics as g', 'g.generic_id', 'p.generic_id')
      .leftJoin('mm_labelers as lm', 'lm.labeler_id', 'p.m_labeler_id')
      .leftJoin('mm_labelers as lv', 'lv.labeler_id', 'p.v_labeler_id')
      .leftJoin('mm_product_groups as pg', 'pg.product_group_id', 'p.product_group_id')
      .where('p.product_id', productId);
  }

  remove(knex: Knex, productId: string) {
    return knex('mm_products')
      .where('product_id', productId)
      .update('mark_deleted', 'Y')
      .update('is_active', 'N')
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
      .update({ mark_deleted: 'Y', is_active: 'N' })
      .where('product_id', productId);
  }

  returnDeleted(knex: Knex, productId: any) {
    return knex('mm_products')
      .update({ mark_deleted: 'N', is_active: 'Y' })
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
    return knex('mm_generics as mg')
      .select(knex.raw('count(mp.product_id) as count,mg.working_code'))
      .leftJoin('mm_products as mp', 'mg.generic_id', 'mp.generic_id')
      .where('mg.generic_id', genericId)
  }

  checkQtyForMarkDeleted(knex: Knex, productId: any) {
    return knex('view_product_reserve')
      .select(knex.raw('sum(stock_qty + reserve_qty) as qty'))
      .where('product_id', productId);
  }

}
