import Knex = require('knex');
import * as moment from 'moment';
export class GenericGroupEDRouteModel {

  list(knex: Knex) {
    return knex('mm_generic_group_ed')
      .where('is_deleted', 'N')
  }

  remove(knex: Knex, genericGroupEDId) {
    return knex('mm_generic_group_ed')
      .where('ed_id', genericGroupEDId)
      .update('is_deleted', 'Y');
  }

  save(knex: Knex, genericGroupEDName) {
    return knex('mm_generic_group_ed')
      .insert({ ed_name: genericGroupEDName });
  }

  update(knex: Knex, genericGroupEDId, genericGroupEDName) {
    return knex('mm_generic_group_ed')
      .where('ed_id', genericGroupEDId)
      .update('ed_name', genericGroupEDName);
  }
}
