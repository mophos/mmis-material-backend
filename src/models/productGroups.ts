import Knex = require('knex');
import * as moment from 'moment';
export class ProductGroupsModel {

  list(knex: Knex) {
    return knex('mm_product_groups')
      .where('is_deleted', 'N')
  }

  remove(knex: Knex, productGroupId) {
    return knex('mm_product_groups')
      .where('product_group_id', productGroupId)
      .update('is_deleted', 'Y');
  }

  save(knex: Knex, productGroupName) {
    return knex('mm_product_groups')
      .insert({ product_group_name: productGroupName });
  }

  update(knex: Knex, productGroupId, productGroupName) {
    return knex('mm_product_groups')
      .where('product_group_id', productGroupId)
      .update('product_group_name', productGroupName);
  }
}
