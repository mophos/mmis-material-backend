import Knex = require('knex');
import * as moment from 'moment';

export class PackageModel {
  list(knex: Knex) {
    return knex('mm_packages')
    // .orderBy('large_unit')
  }

  save(knex: Knex, datas: any) {
    return knex('mm_packages')
      .insert(datas);
  }

  update(knex: Knex, packageId: string, datas: any) {
    return knex('mm_packages')
      .where('package_id', packageId)
      .update(datas);
  }

  detail(knex: Knex, packageId: string) {
    return knex('mm_packages')
      .where('package_id', packageId);
  }

  remove(knex: Knex, packageId: string) {
    return knex('mm_packages')
      .where('package_id', packageId)
      .del();
  }

}