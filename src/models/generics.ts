import Knex = require('knex');
import * as moment from 'moment';
const request = require("request");
export class GenericsModel {

  getTotalByType(knex: Knex, typeId: any) {
    if (typeId) {
      return knex('mm_generics')
        .select(knex.raw('count(*) as total'))
        .whereIn('generic_type_id', typeId);
    } else {
      return knex('mm_generics')
        .select(knex.raw('count(*) as total'))
    }
  }

  searchTotal(knex: Knex, query: any, groupId: any) {
    let _query = `%${query}%`;

    return knex('mm_generics')
      .select(knex.raw('count(*) as total'))
      .where(w => {
        w.orWhere('generic_name', 'like', _query)
          .orWhere('working_code', query)
          .orWhere('keywords', 'like', _query)
      })
      .whereIn('generic_type_id', groupId);
  }

  search(knex: Knex, limit: number, offset: any, query: any, groupId: any) {
    let _query = `%${query}%`;
    if (groupId) {
      return knex('mm_generics as mg')
        .select('mg.*', 'ac.account_name', 'd.dosage_name',
          't.generic_type_name', 'u.unit_name as primary_unit_name')
        // .leftJoin('mm_generic_groups as g', 'g.group_id', 'mg.group_id')
        .leftJoin('mm_generic_accounts as ac', 'ac.account_id', 'mg.account_id')
        .leftJoin('mm_generic_dosages as d', 'd.dosage_id', 'mg.dosage_id')
        .leftJoin('mm_generic_types as t', 't.generic_type_id', 'mg.generic_type_id')
        .leftJoin('mm_units as u', 'u.unit_id', 'mg.primary_unit_id')
        .where('mg.mark_deleted', '<>', 'Y')
        .whereIn('mg.generic_type_id', groupId)
        .where(w => {
          w.orWhere('mg.generic_name', 'like', _query)
            .orWhere('mg.working_code', query)
            .orWhere('mg.keywords', 'like', _query)
        })
        .orderBy('mg.generic_name')
        .limit(limit)
        .offset(offset)
    } else {
      return knex('mm_generics as mg')
        .select('mg.*', 'ac.account_name', 'd.dosage_name',
          't.generic_type_name', 'u.unit_name as primary_unit_name')
        // .leftJoin('mm_generic_groups as g', 'g.group_id', 'mg.group_id')
        .leftJoin('mm_generic_accounts as ac', 'ac.account_id', 'mg.account_id')
        .leftJoin('mm_generic_dosages as d', 'd.dosage_id', 'mg.dosage_id')
        .leftJoin('mm_generic_types as t', 't.generic_type_id', 'mg.generic_type_id')
        .leftJoin('mm_units as u', 'u.unit_id', 'mg.primary_unit_id')
        .where('mg.mark_deleted', '<>', 'Y')
        .where(w => {
          w.orWhere('mg.generic_name', 'like', _query)
            .orWhere('mg.working_code', query)
        })
        .orderBy('mg.generic_name')
        .limit(limit)
        .offset(offset)
    }

  }

  getListByType(knex: Knex, limit: number, offset: number, typeId: any) {
    let sql = null;
    if (typeId) {
      return knex('mm_generics as mg')
        .select('mg.*', 'ac.account_name', 'd.dosage_name',
          't.generic_type_name', 'u.unit_name as primary_unit_name')
        // .leftJoin('mm_generic_groups as g', 'g.group_id', 'mg.group_id')
        .leftJoin('mm_generic_accounts as ac', 'ac.account_id', 'mg.account_id')
        .leftJoin('mm_generic_dosages as d', 'd.dosage_id', 'mg.dosage_id')
        .leftJoin('mm_generic_types as t', 't.generic_type_id', 'mg.generic_type_id')
        .leftJoin('mm_units as u', 'u.unit_id', 'mg.primary_unit_id')
        .where('mg.mark_deleted', '<>', 'Y')
        .whereIn('mg.generic_type_id', typeId)
        .orderBy('mg.generic_name')
        .limit(limit)
        .offset(offset);

    } else {
      return knex('mm_generics as mg')
        .select('mg.*', 'ac.account_name', 'd.dosage_name',
          't.generic_type_name', 'u.unit_name as primary_unit_name')
        // .leftJoin('mm_generic_groups as g', 'g.group_id', 'mg.group_id')
        .leftJoin('mm_generic_accounts as ac', 'ac.account_id', 'mg.account_id')
        .leftJoin('mm_generic_dosages as d', 'd.dosage_id', 'mg.dosage_id')
        .leftJoin('mm_generic_types as t', 't.generic_type_id', 'mg.generic_type_id')
        .leftJoin('mm_units as u', 'u.unit_id', 'mg.primary_unit_id')
        .where('mg.mark_deleted', '<>', 'Y')
        .orderBy('mg.generic_name')
        .limit(limit)
        .offset(offset);
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

  checkRemove(knex: Knex, genericId: string) {
    return knex('mm_products')
      .where('generic_id', genericId)
      .where('mark_deleted', 'N')
      .where('is_active', 'Y');
  }

  getTypes(knex: Knex) {
    return knex('mm_generic_types')
      .where('is_actived', 'Y');
  }

  getGenericType(knex: Knex) {
    return knex('mm_generic_hosp')
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

  getPlanningWarehouse(knex: Knex, genericId: any) {
    return knex('mm_generic_planning as gp')
      .select('gp.*', 'u.unit_name', 'u.unit_code', 'w.warehouse_name', 'ws.warehouse_name as source_warehouse_name')
      .leftJoin('mm_units as u', 'u.unit_id', 'gp.primary_unit_id')
      .leftJoin('wm_warehouses as w', 'w.warehouse_id', 'gp.warehouse_id')
      .leftJoin('wm_warehouses as ws', 'ws.warehouse_id', 'gp.source_warehouse_id')
      .where('gp.generic_id', genericId);
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