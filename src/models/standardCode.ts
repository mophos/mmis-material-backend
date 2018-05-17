import Knex = require('knex');
import * as moment from 'moment';

export class StandardCodeModel {
  getCountries(knex: Knex) {
    return knex('l_country')
      .orderBy('thai_name')
  }

  getTambon(knex: Knex, ampurCode: string, provinceCode: string) {
    let _ampurCode = `${provinceCode}${ampurCode}`;
    return knex('l_tambon')
      .where({
        ampur_code: _ampurCode,
        province_code: provinceCode
      })
      .orderBy('tambon_name');
  }

  getAmpur(knex: Knex, province_code: string) {
    return knex('l_ampur')
      .where({
        province_code: province_code
      })
      .orderBy('ampur_name');
  }

  getChangwat(knex: Knex) {
    return knex('l_province')
      .orderBy('province_name');
  }

  getLabelerTypes(knex: Knex) {
    return knex('mm_labeler_types')
      .orderBy('type_name');
  }

  getLabelerStatus(knex: Knex) {
    return knex('mm_labeler_status')
      .orderBy('status_name');
  }

  getGenericGroups1(knex: Knex) {
    return knex('mm_generic_group_1')
      .orderBy('group_code_1');
  }

  getGenericGroups2(knex: Knex, groupCode1 = '') {
    return knex('mm_generic_group_2')
      .where('group_code_1', 'like', `%${groupCode1}%`)
      .orderBy('group_code_2');
  }

  getGenericGroups3(knex: Knex, groupCode1 = '', groupCode2 = '') {
    return knex('mm_generic_group_3')
      .where('group_code_1', groupCode1)
      .where('group_code_2', groupCode2)
      .orderBy('group_code_3');
  }

  getGenericGroups4(knex: Knex, groupCode1 = '', groupCode2 = '', groupCode3 = '') {
    return knex('mm_generic_group_4')
      .where('group_code_1', groupCode1)
      .where('group_code_2', groupCode2)
      .where('group_code_3', groupCode3)
      .orderBy('group_code_4');
  }



  getGenericTypes(knex: Knex) {
    return knex('mm_generic_types')
      .orderBy('generic_type_name');
  }

  getGenericHospType(knex: Knex) {
    return knex('mm_generic_hosp');
  }

  getGenericDosage(knex: Knex) {
    return knex('mm_generic_dosages')
      .orderBy('dosage_name');
  }

  getGenericSuppliesTypes(knex: Knex) {
    return knex('mm_generic_supplies_types')
      .orderBy('type_name');
  }

  getWarehouseList(knex: Knex) {
    return knex('wm_warehouses')
      .orderBy('warehouse_name');
  }

  getProductGroups(knex: Knex) {
    return knex('mm_generic_types');
  }

  getGenericAccounts(knex: Knex) {
    return knex('mm_generic_accounts');
  }

  getBitTypes(knex: Knex) {
    return knex('l_bid_type');
  }

  getProductType(knex: Knex) {
    return knex('mm_generic_hosp');
  }

}