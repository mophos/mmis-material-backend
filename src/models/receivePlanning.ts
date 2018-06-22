import Knex = require('knex');
import * as moment from 'moment';

export class ReceivePlanningModel {

  list(knex: Knex, genericId) {
    return knex('wm_receive_plannings as r')
      .select('r.generic_id', 'w.*')
      .join('wm_warehouses as w', 'w.warehouse_id', 'r.warehouse_id')
      .where('r.generic_id', genericId)
  }

  save(knex: Knex, genericId, warehouseId) {
    return knex('wm_receive_plannings')
      .insert({ 'generic_id': genericId, 'warehouse_id': warehouseId });
  }

  remove(knex: Knex, genericId, warehouseId) {
    return knex('wm_receive_plannings')
      .where('generic_id', genericId)
      .where('warehouse_id', warehouseId)
      .del();
  }
}
