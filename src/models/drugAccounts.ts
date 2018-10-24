import Knex = require('knex');
import * as moment from 'moment';

export class DrugAccountModel {
  list(knex: Knex,btnD: any = 'N') {
   let query =  knex('mm_generic_hosp')
    if(btnD === 'N') query.where('is_deleted','N')
    return query
  }

  save(knex: Knex, datas: any) {
    return knex('mm_generic_hosp')
      .insert(datas);
  }

  update(knex: Knex, Id: string, data: any) {
    return knex('mm_generic_hosp')
      .where('id', Id)
      .update(data);
  }

  detail(knex: Knex, Id: string) {
    return knex('mm_generic_hosp')
      .where('id', Id);
  }
  reRemove(knex: Knex, Id: string) {
    return knex('mm_generic_hosp')
      .where('id', Id)
      .update('is_deleted','N');
  }
  remove(knex: Knex, Id: string) {
    return knex('mm_generic_hosp')
      .where('id', Id)
      .update('is_deleted','Y');
  }

}