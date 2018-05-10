import Knex = require('knex');
import * as moment from 'moment';

export class DrugGroupModel {
  list(knex: Knex) {
    return knex('mm_generic_groups')
      .where('is_deleted', 'N')
      .where('is_active','Y')
      .orderBy('group_name');
  }

  listAll(knex: Knex) {
    return knex('mm_generic_groups')
      .where('is_deleted', 'N')
      .orderBy('group_name');
  }

  save(knex: Knex, datas: any) {
    return knex('mm_generic_groups')
      .insert(datas);
  }
  
  update(knex: Knex, groupId: string, datas: any) {
    return knex('mm_generic_groups')
      .where('group_id', groupId)
      .update(datas);
  }
  
  active(knex: Knex, groupId: any,status) {
    console.log(groupId,status,'5555555');
    
    return knex('mm_generic_groups')
      .where('group_id', groupId)
      .update('is_active',status);
  }

  remove(knex: Knex, groupId: string) {
    return knex('mm_generic_groups')
      .where('group_id', groupId)
      .update('is_deleted', 'Y')
  }

}