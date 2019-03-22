import Knex = require('knex');

export class MappingModel {
  getMappings(knex: Knex, productId) {
    return knex('mm_products as p')
      .select('edi_labeler_code', 'tmt_id')
      .where({ 'product_id': productId })
  }

  saveMappings(knex: Knex, productId, data) {
    return knex('mm_products as p')
      .update(data)
      .where({ 'product_id': productId })
  }


  searchTmtCode(knex: Knex, query: any) {
    let _query = `%${query}%`
    return knex('tmt_tpu as tpu')
      .select('tpu.TMTID', 'tpu.FSN')
      .where(w => {
        w.where('tpu.TMTID', 'like', _query)
          .orWhere('tpu.FSN', 'like', _query)
      })
      .limit(10);
  }

}