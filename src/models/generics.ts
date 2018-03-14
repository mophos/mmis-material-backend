import Knex = require('knex');
import * as moment from 'moment';

export class GenericsModel {

  getTotalByType(knex: Knex, typeId: any) {
    if (typeId) {
      return knex('mm_generics')
        .select(knex.raw('count(*) as total'))
        .where('generic_type_id', typeId);
    } else {
      return knex('mm_generics')
        .select(knex.raw('count(*) as total'))
    }
  }

  searchTotal(knex: Knex, query: any) {
    let _query = `%${query}%`;

    return knex('mm_generics')
      .select(knex.raw('count(*) as total'))
      .where(w => {
        w.orWhere('generic_name', 'like', _query)
          .orWhere('working_code', query)
      });
  }

  search(knex: Knex, limit: number, offset: any, query: any, groupId: any) {
    let _query = `%${query}%`;
    if(groupId){
      return knex('mm_generics as mg')
      .select('mg.*', 'g.group_name', 'ac.account_name', 'd.dosage_name',
        't.generic_type_name', 'u.unit_name as primary_unit_name')
      .leftJoin('mm_generic_groups as g', 'g.group_id', 'mg.group_id')
      .leftJoin('mm_generic_accounts as ac', 'ac.account_id', 'mg.account_id')
      .leftJoin('mm_generic_dosages as d', 'd.dosage_id', 'mg.dosage_id')
      .leftJoin('mm_generic_types as t', 't.generic_type_id', 'mg.generic_type_id')
      .leftJoin('mm_units as u', 'u.unit_id', 'mg.primary_unit_id')
      .where('mg.mark_deleted', '<>', 'Y')
      .where('mg.generic_type_id', groupId)
      .where(w => {
        w.orWhere('mg.generic_name', 'like', _query)
          .orWhere('mg.working_code', query)
      })
      .orderBy('mg.generic_name')
      .limit(limit)
      .offset(offset)
    } else{
      return knex('mm_generics as mg')
      .select('mg.*', 'g.group_name', 'ac.account_name', 'd.dosage_name',
        't.generic_type_name', 'u.unit_name as primary_unit_name')
      .leftJoin('mm_generic_groups as g', 'g.group_id', 'mg.group_id')
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
      // sql = `
      // select mg.*, g.group_name, ac.account_name, d.dosage_name, t.generic_type_name,
      // u.unit_name as primary_unit_name
      // from mm_generics as mg
      // left join mm_generic_groups as g on g.group_id=mg.group_id
      // left join mm_generic_accounts as ac on ac.account_id=mg.account_id
      // left join mm_generic_dosages as d on d.dosage_id=mg.dosage_id
      // left join mm_generic_types as t on t.generic_type_id=mg.generic_type_id
      // left join mm_units as u on u.unit_id=mg.primary_unit_id
      // where mg.mark_deleted<>'Y'
      // and mg.generic_type_id=?
      // order by mg.generic_name
      // limit ? offset ?
      // `;

      return knex('mm_generics as mg')
        .select('mg.*', 'g.group_name', 'ac.account_name', 'd.dosage_name',
          't.generic_type_name', 'u.unit_name as primary_unit_name')
        .leftJoin('mm_generic_groups as g', 'g.group_id', 'mg.group_id')
        .leftJoin('mm_generic_accounts as ac', 'ac.account_id', 'mg.account_id')
        .leftJoin('mm_generic_dosages as d', 'd.dosage_id', 'mg.dosage_id')
        .leftJoin('mm_generic_types as t', 't.generic_type_id', 'mg.generic_type_id')
        .leftJoin('mm_units as u', 'u.unit_id', 'mg.primary_unit_id')
        .where('mg.mark_deleted', '<>', 'Y')
        .where('mg.generic_type_id', typeId)
        .orderBy('mg.generic_name')
        .limit(limit)
        .offset(offset);
      // return knex.raw(sql, [typeId, limit, offset]);

    } else {
      // sql = `
      // select mg.*, g.group_name, ac.account_name, d.dosage_name, t.generic_type_name,
      // u.unit_name as primary_unit_name
      // from mm_generics as mg
      // left join mm_generic_groups as g on g.group_id=mg.group_id
      // left join mm_generic_accounts as ac on ac.account_id=mg.account_id
      // left join mm_generic_dosages as d on d.dosage_id=mg.dosage_id
      // left join mm_generic_types as t on t.generic_type_id=mg.generic_type_id
      // left join mm_units as u on u.unit_id=mg.primary_unit_id
      // where mg.mark_deleted<>'Y'
      // order by mg.generic_name
      // limit ? offset ?
      // `;

      // return knex.raw(sql, [limit, offset]);
      return knex('mm_generics as mg')
        .select('mg.*', 'g.group_name', 'ac.account_name', 'd.dosage_name',
          't.generic_type_name', 'u.unit_name as primary_unit_name')
        .leftJoin('mm_generic_groups as g', 'g.group_id', 'mg.group_id')
        .leftJoin('mm_generic_accounts as ac', 'ac.account_id', 'mg.account_id')
        .leftJoin('mm_generic_dosages as d', 'd.dosage_id', 'mg.dosage_id')
        .leftJoin('mm_generic_types as t', 't.generic_type_id', 'mg.generic_type_id')
        .leftJoin('mm_units as u', 'u.unit_id', 'mg.primary_unit_id')
        .where('mg.mark_deleted', '<>', 'Y')
        // .where('mg.generic_type_id', typeId)
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

  getTypes(knex: Knex) {
    return knex('mm_generic_types')
      .where('isactive', '1');
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
    let _query = `${query}%`;
    let _queryAll = `%${query}%`;
    return knex('mm_generics')
      .where(w => {
        w.where('generic_name', 'like', _query)
          .orWhere('working_code', query)
          .orWhere('keywords', 'like', _queryAll)
      })
      .whereIn('generic_type_id', generic_type_id)
      .where('is_active','Y')
      .where('mark_deleted','N')
      .limit(10);
  }

}