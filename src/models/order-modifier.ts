import Knex = require('knex');
import * as moment from 'moment';

export class OrderModifierModel {
  save(knex: Knex, data: any) {
    return knex('mm_product_planning')
      .insert(data);
  }

  getOrderModifiers(knex: Knex, productId: any) {
    return knex('mm_product_planning as mm')
      .select('mm.*', 'w.warehouse_name')
      .innerJoin('wm_warehouses as w', 'w.warehouse_id', 'mm.warehouse_id')
      .where('mm.product_id', productId);
  }

  update(knex: Knex, productOrderModifierId: any, minQty: number, maxQty: number, isActive: any) {
    return knex('mm_product_planning')
      .where('product_order_modifier_id', productOrderModifierId)
      .update({
        min_qty: minQty,
        max_qty: maxQty,
        is_active: isActive
      })
  }

  remove(knex: Knex, productMinmaxId: any) {
    return knex('mm_product_planning')
      .where('product_order_modifier_id', productMinmaxId)
      .del();
  }

}