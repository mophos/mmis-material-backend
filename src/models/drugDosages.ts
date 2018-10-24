import Knex = require('knex');
import * as moment from 'moment';

export class DrugDosageModel {
  listAll(knex: Knex, deleted) {
    let sql = knex('mm_generic_dosages')
    if (!deleted) {
      sql.where('is_deleted', 'N')
    }
    sql.orderBy('dosage_name');
    return sql;
  }

  list(knex: Knex) {
    return knex('mm_generic_dosages')
      .where('is_deleted', 'N')
      .where('is_active', 'Y')
      .orderBy('dosage_name');
  }

  save(knex: Knex, datas: any) {
    return knex('mm_generic_dosages')
      .insert(datas);
  }

  update(knex: Knex, dosageId: string, datas: any) {
    return knex('mm_generic_dosages')
      .where('dosage_id', dosageId)
      .update(datas);
  }
  isactive(knex: Knex, dosageId: string, isactive: any) {
    return knex('mm_generic_dosages')
      .where('dosage_id', dosageId)
      .update(isactive);
  }

  remove(knex: Knex, dosageId: string) {
    return knex('mm_generic_dosages')
      .where('dosage_id', dosageId)
      .update('is_deleted', 'Y')
  }

  returnRemove(knex: Knex, dosageId: string) {
    return knex('mm_generic_dosages')
      .where('dosage_id', dosageId)
      .update('is_deleted', 'N')
  }

}