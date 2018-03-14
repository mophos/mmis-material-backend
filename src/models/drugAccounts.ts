import Knex = require('knex');
import * as moment from 'moment';

export class DrugAccountModel {
  list(knex: Knex) {
    return knex('mm_generic_hosp')
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

  remove(knex: Knex, Id: string) {
    return knex('mm_generic_hosp')
      .where('id', Id)
      .del();
  }

}