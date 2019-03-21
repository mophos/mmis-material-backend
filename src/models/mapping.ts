import Knex = require('knex');

export class MappingModel {
  getEdiLabelerCode(knex: Knex, productId) {
    return knex('mm_products as p')
      .select('edi_labeler_code')
      .where({ 'product_id': productId })
  }

  saveEdiLabelerCode(knex: Knex, productId, ediLabelerCode) {
    return knex('mm_products as p')
      .update({ 'edi_labeler_code': ediLabelerCode })
      .where({ 'product_id': productId })
  }



}