import Knex = require('knex');

export class LotModel {
  allProducts(knex: Knex) {
    return knex('mm_products as p')
      .select('p.*', 'a.generic_id', 'a.generic_name', 'a.generic_type')
      .innerJoin('mm_generic_product as gp', 'gp.product_id', 'p.product_id')
      .innerJoin('wm_all_products_view as a', 'a.generic_id', 'gp.generic_id')
      .orderBy('p.product_name')
  }

  getLots(knex: Knex, productId: any) {
    return knex('wm_product_lots')
      .select('lot_id', 'is_active', 'lot_no', 'expired_date',
      knex.raw('timestampdiff(day, current_date(), expired_date) as count_expired'))  
      .where('product_id', productId)
      .where('mark_deleted', 'N')
      .orderBy('expired_date', 'DESC');
  }

  save(knex: Knex, datas: any) {
    return knex('wm_product_lots')
      .insert(datas);
  }

  update(knex: Knex, lotId: string, datas: any) {
    return knex('wm_product_lots')
      .where('lot_id', lotId)
      .update(datas);
  }

  lotList(knex: Knex, productId: string) {
    return knex('wm_product_lots')
      .where('product_id', productId)
      .where('mark_deleted', 'N');
  }

  remove(knex: Knex, lotId: string) {
    return knex('wm_product_lots')
      .where('lot_id', lotId)
      .update({
        mark_deleted: 'Y'
      });
  }

}