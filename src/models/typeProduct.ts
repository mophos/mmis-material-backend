import Knex = require('knex');
import * as moment from 'moment';

export class typeProductModel {
  list(knex: Knex, deleted: boolean) {
    let query = knex('mm_generic_types')
    if (!deleted) {
      query.where('is_deleted', 'N')
    }
    return query
  }

  getGenericTypeLV1(knex: Knex, deleted: boolean) {
    let query = knex('mm_generic_types')
    if (!deleted) {
      query.where('is_deleted', 'N')
    }
    return query
  }

  getGenericTypeLV2(knex: Knex, deleted: boolean) {
    let query = knex('mm_generic_types_lv2 as mg2')
      .select('mg.generic_type_name as generic_type_lv1_name', 'mg2.generic_type_lv1_id',
        'mg2.generic_type_lv2_id', 'mg2.generic_type_lv2_name', 'mg2.is_deleted')
      .join('mm_generic_types as mg', 'mg.generic_type_id', 'mg2.generic_type_lv1_id')
    if (!deleted) {
      query.where('mg2.is_deleted', 'N')
    }
    console.log(query.toString());

    return query
  }

  getGenericTypeLV3(knex: Knex, deleted: boolean) {
    let query = knex('mm_generic_types_lv3 as mg3')
      .select('mg.generic_type_name as generic_type_lv1_name', 'mg2.generic_type_lv1_id',
        'mg2.generic_type_lv2_id', 'mg2.generic_type_lv2_name',
        'mg3.generic_type_lv3_id', 'mg3.generic_type_lv3_name', 'mg3.is_deleted')
      .join('mm_generic_types as mg', 'mg.generic_type_id', 'mg3.generic_type_lv1_id')
      .join('mm_generic_types_lv2 as mg2', 'mg2.generic_type_lv2_id', 'mg3.generic_type_lv2_id')
    if (!deleted) {
      query.where('mg3.is_deleted', 'N')
    }
    return query
  }

  save(knex: Knex, datas: any) {
    return knex('mm_generic_types')
      .insert(datas);
  }

  saveLv1(knex: Knex, datas: any) {
    return knex('mm_generic_types')
      .insert(datas);
  }

  saveLv2(knex: Knex, datas: any) {
    return knex('mm_generic_types_lv2')
      .insert(datas);
  }

  saveLv3(knex: Knex, datas: any) {
    return knex('mm_generic_types_lv3')
      .insert(datas);
  }

  update(knex: Knex, typeId: string, datas: any) {
    return knex('mm_generic_types')
      .where('generic_type_id', typeId)
      .update(datas);
  }
  updateLV1(knex: Knex, typeId: string, datas: any) {
    return knex('mm_generic_types')
      .where('generic_type_id', typeId)
      .update(datas);
  }
  updateLV2(knex: Knex, genericTypeLV2Id: string, datas: any) {
    return knex('mm_generic_types_lv2')
      .where('generic_type_lv2_id', genericTypeLV2Id)
      .update(datas);
  }
  updateLV3(knex: Knex, genericTypeLV2I3: string, datas: any) {
    return knex('mm_generic_types_lv3')
      .where('generic_type_lv3_id', genericTypeLV2I3)
      .update(datas);
  }

  detail(knex: Knex, typeId: string) {
    return knex('mm_generic_types')
      .where('generic_type_id', typeId);
  }

  removeLV1(knex: Knex, typeId: string) {
    return knex('mm_generic_types')
      .where('generic_type_id', typeId)
      .update('is_deleted', 'Y')
  }

  removeLV2(knex: Knex, typeId: string) {
    return knex('mm_generic_types_lv2')
      .where('generic_type_lv2_id', typeId)
      .update('is_deleted', 'Y')
  }

  removeLV3(knex: Knex, typeId: string) {
    return knex('mm_generic_types_lv3')
      .where('generic_type_lv3_id', typeId)
      .update('is_deleted', 'Y')
  }

  returnRemoveLV1(knex: Knex, Id: string) {
    return knex('mm_generic_types')
      .where('generic_type_id', Id)
      .update('is_deleted', 'N');
  }

  returnRemoveLV2(knex: Knex, Id: string) {
    return knex('mm_generic_types_lv2')
      .where('generic_type_lv2_id', Id)
      .update('is_deleted', 'N');
  }

  returnRemoveLV3(knex: Knex, Id: string) {
    return knex('mm_generic_types_lv3')
      .where('generic_type_lv3_id', Id)
      .update('is_deleted', 'N');
  }
}