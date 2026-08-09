import Knex = require('knex');
import * as moment from 'moment';
const request = require("request");
export class GenericsModel {

  getTotalByType(knex: Knex, typeId: any, deleted) {
    if (typeId) {
      let sql = knex('mm_generics')
        .select(knex.raw('count(*) as total'))
        .whereIn('generic_type_id', typeId)
      if (!deleted) {
        sql.where('mark_deleted', 'N')
      }
      return sql;
    } else {
      let sql = knex('mm_generics')
        .select(knex.raw('count(*) as total'))
      if (!deleted) {
        sql.where('mark_deleted', 'N')
      }
      return sql;
    }
  }

  searchTotal(knex: Knex, query: any, genericType: any, deleted: boolean) {
    let _query = `%${query}%`;

    let sql = knex('mm_generics')
      .select(knex.raw('count(*) as total'))
      .where(w => {
        w.orWhere('generic_name', 'like', _query)
          .orWhere('working_code', query)
          .orWhere('keywords', 'like', _query)
      })
    if (genericType) {
      if (genericType.generic_type_lv1_id.length) {
        sql.whereIn('generic_type_id', genericType.generic_type_lv1_id);
      }
      if (genericType.generic_type_lv2_id.length) {
        sql.whereIn('generic_type_lv2_id', genericType.generic_type_lv2_id);
      }
      if (genericType.generic_type_lv3_id.length) {
        sql.whereIn('generic_type_lv3_id', genericType.generic_type_lv3_id);
      }
    }
    if (!deleted) {
      sql.where('mark_deleted', 'N')
    }
    return sql;
  }

  search(knex: Knex, limit: number, offset: any, query: any, genericType: any, deleted: boolean, sort: any) {
    let _query = `%${query}%`;

    let sql = knex('mm_generics as mg')
      .select('mg.*', 'ac.account_name', 'd.dosage_name',
        't.generic_type_name', 'u.unit_name as primary_unit_name')
      .leftJoin('mm_generic_accounts as ac', 'ac.account_id', 'mg.account_id')
      .leftJoin('mm_generic_dosages as d', 'd.dosage_id', 'mg.dosage_id')
      .leftJoin('mm_generic_types as t', 't.generic_type_id', 'mg.generic_type_id')
      .leftJoin('mm_units as u', 'u.unit_id', 'mg.primary_unit_id')
    if (genericType) {
      if (genericType.generic_type_lv1_id.length) {
        sql.whereIn('mg.generic_type_id', genericType.generic_type_lv1_id);
      }
      if (genericType.generic_type_lv2_id.length) {
        sql.whereIn('mg.generic_type_lv2_id', genericType.generic_type_lv2_id);
      }
      if (genericType.generic_type_lv3_id.length) {
        sql.whereIn('mg.generic_type_lv3_id', genericType.generic_type_lv3_id);
      }
    }
    sql.where(w => {
      w.orWhere('mg.generic_name', 'like', _query)
        .orWhere('mg.working_code', query)
        .orWhere('mg.keywords', 'like', _query)
    })
    if (!deleted) {
      sql.where('mg.mark_deleted', 'N');
    }
    if (sort.by) {
      let reverse = sort.reverse ? 'DESC' : 'ASC';
      if (sort.by === 'generic_name') {
        sql.orderBy('mg.generic_name', reverse)
      } else if (sort.by === 'working_code') {
        sql.orderBy('mg.working_code', reverse)
      } else if (sort.by === 'account_name') {
        sql.orderBy('ac.account_name', reverse)
      } else if (sort.by === 'primary_unit_name') {
        sql.orderBy('u.unit_name', reverse)
      } else if (sort.by === 'generic_type_name') {
        sql.orderBy('t.generic_type_name', reverse)
      }
    } else {
      sql.orderBy('mg.generic_name')
    }
    sql.limit(limit)
      .offset(offset)
    return sql;


  }

  getListByType(knex: Knex, limit: number, offset: number, typeId: any, deleted, sort: any) {
    let sql = null;
    if (typeId) {
      let sql = knex('mm_generics as mg')
        .select('mg.*', 'ac.account_name', 'd.dosage_name',
          't.generic_type_name', 'u.unit_name as primary_unit_name')
        // .leftJoin('mm_generic_groups as g', 'g.group_id', 'mg.group_id')
        .leftJoin('mm_generic_accounts as ac', 'ac.account_id', 'mg.account_id')
        .leftJoin('mm_generic_dosages as d', 'd.dosage_id', 'mg.dosage_id')
        .leftJoin('mm_generic_types as t', 't.generic_type_id', 'mg.generic_type_id')
        .leftJoin('mm_units as u', 'u.unit_id', 'mg.primary_unit_id')
      if (!deleted) {
        sql.where('mg.mark_deleted', 'N')
      }
      sql.whereIn('mg.generic_type_id', typeId)
      if (sort.by) {
        let reverse = sort.reverse ? 'DESC' : 'ASC';
        if (sort.by === 'generic_name') {
          sql.orderBy('mg.generic_name', reverse)
        } else if (sort.by === 'working_code') {
          sql.orderBy('mg.working_code', reverse)
        } else if (sort.by === 'account_name') {
          sql.orderBy('ac.account_name', reverse)
        } else if (sort.by === 'primary_unit_name') {
          sql.orderBy('u.unit_name', reverse)
        } else if (sort.by === 'generic_type_name') {
          sql.orderBy('t.generic_type_name', reverse)
        }
      } else {
        sql.orderBy('mg.generic_name')
      }
      sql.limit(limit)
        .offset(offset);
      return sql;

    } else {
      let sql = knex('mm_generics as mg')
        .select('mg.*', 'ac.account_name', 'd.dosage_name',
          't.generic_type_name', 'u.unit_name as primary_unit_name')
        // .leftJoin('mm_generic_groups as g', 'g.group_id', 'mg.group_id')
        .leftJoin('mm_generic_accounts as ac', 'ac.account_id', 'mg.account_id')
        .leftJoin('mm_generic_dosages as d', 'd.dosage_id', 'mg.dosage_id')
        .leftJoin('mm_generic_types as t', 't.generic_type_id', 'mg.generic_type_id')
        .leftJoin('mm_units as u', 'u.unit_id', 'mg.primary_unit_id')
      if (!deleted) {
        sql.where('mg.mark_deleted', 'N')
      }
      if (sort.by) {
        let reverse = sort.reverse ? 'DESC' : 'ASC';
        if (sort.by === 'generic_name') {
          sql.orderBy('mg.generic_name', reverse)
        } else if (sort.by === 'working_code') {
          sql.orderBy('mg.working_code', reverse)
        } else if (sort.by === 'account_name') {
          sql.orderBy('ac.account_name', reverse)
        } else if (sort.by === 'primary_unit_name') {
          sql.orderBy('u.unit_name', reverse)
        } else if (sort.by === 'generic_type_name') {
          sql.orderBy('t.generic_type_name', reverse)
        }
      } else {
        sql.orderBy('mg.generic_name')
      }
      sql.limit(limit)
        .offset(offset);
      return sql;
    }
  }

  save(knex: Knex, datas: any) {
    return knex('mm_generics')
      .insert(datas);
  }

  update(knex: Knex, genericId: string, datas: any) {
    return knex('mm_generics')
      .where('generic_id', genericId)
      .update(datas);
  }

  detail(knex: Knex, genericId: string) {
    return knex('mm_generics')
      .where('generic_id', genericId);
  }

  remove(knex: Knex, genericId: string) {
    return knex('mm_generics')
      .where('generic_id', genericId)
      .update({
        mark_deleted: 'Y',
        is_active: 'N'
      });
  }

  return(knex: Knex, genericId: string) {
    return knex('mm_generics')
      .where('generic_id', genericId)
      .update({
        mark_deleted: 'N',
        is_active: 'Y'
      });
  }

  checkRemove(knex: Knex, genericId: string) {
    return knex('mm_products')
      .where('generic_id', genericId)
      .where('mark_deleted', 'N')
      .where('is_active', 'Y');
  }

  getTypes(knex: Knex) {
    return knex('mm_generic_types')
      .where('is_actived', 'Y')
      .where('is_deleted', 'N');
  }

  getGenericType(knex: Knex) {
    return knex('mm_generic_hosp')
      .where('is_deleted', 'N')
  }

  savePlanningInventory(knex: Knex, data: any) {
    return knex('mm_generic_planning')
      .insert(data);
  }

  saveExpiredAlert(knex: Knex, id: any, expried: any) {
    return knex('wm_generic_expired_alert')
      .insert({
        generic_id: id,
        num_days: expried
      });
  }

  addAllGenericPlanning(knex: Knex, warehouseId: any, genericTypeId: any) {
    let sql = `INSERT INTO mm_generic_planning (generic_id,warehouse_id,is_active,max_qty,min_qty,primary_unit_id)
    SELECT mg.generic_id,wm.warehouse_id,'Y',mg.max_qty,mg.min_qty,mg.primary_unit_id FROM mm_generics mg
    CROSS join  wm_warehouses wm WHERE wm.warehouse_id = ${warehouseId} AND mg.generic_type_id = ${genericTypeId}`;
    return knex.raw(sql)
  }

  addGenericByWarehouse(knex: Knex, dstWarehouseId: any, srcWarehouseId: any) {
    let sql = `INSERT INTO mm_generic_planning(generic_id,warehouse_id,primary_unit_id,min_qty,max_qty)
    SELECT generic_id,'${srcWarehouseId}',primary_unit_id,min_qty,max_qty FROM mm_generic_planning WHERE warehouse_id = ${dstWarehouseId}`;
    console.log(sql, 'xzczxczxcxzcxczczxczx');
    return knex.raw(sql);
  }

  getPlanningWarehouse(knex: Knex, genericId: any) {
    return knex('mm_generic_planning as gp')
      .select('gp.*', 'u.unit_name', 'u.unit_code', 'w.warehouse_name', 'ws.warehouse_name as source_warehouse_name')
      .leftJoin('mm_units as u', 'u.unit_id', 'gp.primary_unit_id')
      .leftJoin('wm_warehouses as w', 'w.warehouse_id', 'gp.warehouse_id')
      .leftJoin('wm_warehouses as ws', 'ws.warehouse_id', 'gp.source_warehouse_id')
      .where('gp.generic_id', genericId);
  }

  getPlanningByWarehouse(knex: Knex, warehouseId: any) {
    return knex('mm_generic_planning as gp')
      .select('gp.*', 'u.unit_name', 'u.unit_code', 'w.warehouse_name', 'mg.working_code', 'mg.generic_name')
      .join('mm_generics as mg', 'gp.generic_id', 'mg.generic_id')
      .leftJoin('mm_units as u', 'u.unit_id', 'gp.primary_unit_id')
      .leftJoin('wm_warehouses as w', 'w.warehouse_id', 'gp.warehouse_id')
      .where('w.warehouse_id', warehouseId)
      .orderBy('mg.generic_name');
  }

  updateMinQty(knex: Knex, genericPlanningId: any, data: any) {
    return knex('mm_generic_planning')
      .where('generic_planning_id', genericPlanningId)
      .update(data);
  }

  updateMaxQty(knex: Knex, genericPlanningId: any, data: any) {
    return knex('mm_generic_planning')
      .where('generic_planning_id', genericPlanningId)
      .update(data);
  }

  updatePlanningInventory(knex: Knex, genericPlanningId: any, data: any) {
    return knex('mm_generic_planning')
      .where('generic_planning_id', genericPlanningId)
      .update(data)
  }

  removePlanningInventroy(knex: Knex, genericPlanningId: any) {
    return knex('mm_generic_planning')
      .where('generic_planning_id', genericPlanningId)
      .del();
  }

  removePlanningInventroybyWarehouse(knex: Knex, warehouseId: any) {
    return knex('mm_generic_planning')
      .where('warehouse_id', warehouseId)
      .del();
  }

  removePlanningInventroybyGenericPlanningId(knex: Knex, genericPlanningId: any) {
    return knex('mm_generic_planning')
      .where('generic_planning_id', genericPlanningId)
      .del();
  }

  searchAutoComplete(knex: Knex, query: any, generic_type_id: any) {
    let q_ = `${query}%`;
    let _q_ = `%${query}%`;
    let sql = `SELECT
    DISTINCT *
      FROM
      (
        SELECT
          *
        FROM
          (
            SELECT
              *
            FROM
              mm_generics
            WHERE
              working_code = '${query}'
              and generic_type_id in (${generic_type_id})
              and is_active = 'Y'
              and mark_deleted = 'N'
          ) AS s
        UNION ALL
          SELECT
            *
          FROM
            (
              SELECT
                *
              FROM
                mm_generics
              WHERE
                generic_name LIKE '${q_}'
                and generic_type_id in (${generic_type_id})
                and is_active = 'Y'
               and mark_deleted = 'N'
              LIMIT 5
            ) AS s
          UNION ALL
            SELECT
              *
            FROM
              (
                SELECT
                  *
                FROM
                  mm_generics
                WHERE
                 (generic_name LIKE '${_q_}'
                  OR keywords LIKE '${_q_}'
                  )
              and generic_type_id in (${generic_type_id})
              and is_active = 'Y'
              and mark_deleted = 'N'
                ORDER BY
                  generic_name
                LIMIT 10
              ) AS s
      ) AS a`
    return knex.raw(sql);
  }
  searchDc24(q) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        url: `http://nmpcd.moph.go.th/api/nmpcd/search/dc24?q=${q}`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          // 'postman-token': 'c63b4187-f395-a969-dd57-19018273670b',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        },
        json: true
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }
}