import Knex = require('knex');
const request = require("request");
export class MappingModel {
  getMappings(knex: Knex, productId) {
    return knex('mm_products as p')
      .select('edi_labeler_code', 'tmt_id', 'std_code')
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
  searchDc24(q) {
    return new Promise((resolve: any, reject: any) => {
      var options = {
        method: 'GET',
        url: `http://nmpcd.moph.go.th/api/nmpcd/search/dc24?q=${q}`,
        agentOptions: {
          rejectUnauthorized: false
        },
        headers:
        {
          // 'postman-token': 'c63b4187-f395-a969-dd57-19018273670b',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        },
        json: true
      };

      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }
}