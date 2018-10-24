import Knex = require('knex');
import * as moment from 'moment';
export class GenericGroupEDRouteModel {

  list(knex: Knex, deleted) {
    let sql = knex('mm_generic_group_ed')
    if (!deleted) {
      sql.where('is_deleted', 'N')
    }
    return sql;
  }

  remove(knex: Knex, genericGroupEDId) {
    return knex('mm_generic_group_ed')
      .where('ed_id', genericGroupEDId)
      .update('is_deleted', 'Y');
  }

  returnRemove(knex: Knex, genericGroupEDId) {
    return knex('mm_generic_group_ed')
      .where('ed_id', genericGroupEDId)
      .update('is_deleted', 'N');
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
