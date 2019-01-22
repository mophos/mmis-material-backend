import Knex = require('knex');
import * as moment from 'moment';

export class MinMaxGroupModel {
  list(knex: Knex, deleted: boolean) {
    let query = knex('mm_minmax_groups')
    if (!deleted) {
      query.where('is_deleted', 'N')
    }
    return query
  }

  save(knex: Knex, datas: any) {
    return knex('mm_minmax_groups')
      .insert(datas);
  }

  update(knex: Knex, Id: string, data: any) {
    return knex('mm_minmax_groups')
      .where('group_id', Id)
      .update(data);
  }

  detail(knex: Knex, Id: string) {
    return knex('mm_minmax_groups')
      .where('group_id', Id);
  }
  reRemove(knex: Knex, Id: string) {
    return knex('mm_minmax_groups')
      .where('group_id', Id)
      .update('is_deleted', 'N');
  }
  remove(knex: Knex, Id: string) {
    return knex('mm_minmax_groups')
      .where('group_id', Id)
      .update('is_deleted', 'Y');
  }

}