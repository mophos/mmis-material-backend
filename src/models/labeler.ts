import Knex = require('knex');
import * as moment from 'moment';
import { ILabeler, IOrganizationStructure } from './model';

export class LabelerModel {
  list(knex: Knex) {

    return knex('mm_labelers as l')
      .select('l.labeler_id', 'l.short_code', 'l.moph_labeler_id', 'l.labeler_name', 'l.nin', 'l.phone', 'ls.status_name', 'lt.type_name')
      .leftJoin('mm_labeler_status as ls', 'ls.status_id', 'l.labeler_status')
      .leftJoin('mm_labeler_types as lt', 'lt.type_id', 'l.labeler_type')
      .where('l.is_deleted','N')
      .orderBy('l.labeler_id');
  }

  getBank(knex: Knex, labelerId) {
    return knex('mm_labeler_bank')
      .where('labeler_id', labelerId)
  }
  search(knex: Knex, query: string) {
    let _query = `%${query}%`;

    return knex('mm_labelers as l')
      .select('l.labeler_id', 'l.moph_labeler_id', 'l.labeler_name', 'l.nin', 'l.phone', 'ls.status_name', 'lt.type_name')
      .leftJoin('mm_labeler_status as ls', 'ls.status_id', 'l.labeler_status')
      .leftJoin('mm_labeler_types as lt', 'lt.type_id', 'l.labeler_type')
      .where('l.labeler_name', 'like', _query)
      .where('l.id_deleted','N')
      .orderBy('l.labeler_id');
  }

  searchAutoComplete(knex: Knex, query: string, type: any = 'M') {
    let _query = `${query}%`;
    let _queryAll = `%${query}%`;

    let db = knex('mm_labelers as l')
      .select('l.labeler_id', 'l.short_code', 'l.moph_labeler_id', 'l.labeler_name', 'l.nin', 'l.phone', 'ls.status_name', 'lt.type_name')
      .leftJoin('mm_labeler_status as ls', 'ls.status_id', 'l.labeler_status')
      .leftJoin('mm_labeler_types as lt', 'lt.type_id', 'l.labeler_type')
      .where(w => {
        w.where('l.labeler_name', 'like', _queryAll)
          .orWhere('l.short_code', query)
          .orWhere('l.nin', query)
      })
      .where('l.is_deleted','N');
    if (type === 'M') {
      db.where('l.is_manufacturer', 'Y');
    } else {
      db.where('l.is_vendor', 'Y');
    }

    db.orderBy('l.labeler_name');
    db.limit(10);
    return db;
  }

  save(knex: Knex, labeler: ILabeler) {
    return knex('mm_labelers').insert(labeler, 'labeler_id');
  }
  checkCode(knex:Knex , labelerCode:any ){
    return knex('mm_labelers')
    .select('labeler_id')
    .where('labeler_code',labelerCode);

  }
  saveDonators(knex: Knex, data: any) {
    return knex('wm_donators')
      .insert(data);
  }

  update(knex: Knex, labelerId: string, labeler: ILabeler) {
    return knex('mm_labelers')
      .where('labeler_id', labelerId)
      .update(labeler);
  }

  updateDonators(knex: Knex, dName: string, data: any) {
    let _query = '%' + dName + '%'
    return knex('wm_donators')
      .where('donator_name', 'like', _query)
      .update(data);
  }

  saveRegisterMCD(knex: Knex, labelerId: string, mcdLabelerId: string) {
    return knex('mm_labelers')
      .where('labeler_id', labelerId)
      .update({
        moph_labeler_id: mcdLabelerId,
        register_date: moment().format('YYYY-MM-DD HH:mm:ss')
      });
  }

  detail(knex: Knex, labelerId: string) {
    return knex('mm_labelers')
      .where('labeler_id', labelerId);
  }

  remove(knex: Knex, labelerId: string) {
    return knex('mm_labelers')
      .where('labeler_id', labelerId)
      .update('is_deleted','Y')
  }

  saveBank(knex: Knex, data: any) {
    return knex('mm_labeler_bank')
      .insert(data);
  }

  updateBank(knex: Knex, bankId: string, data: any) {
    return knex('mm_labeler_bank')
      .where('bank_id', bankId)
      .update(data);
  }

  removeBank(knex: Knex, bankId: string) {
    return knex('mm_labeler_bank')
      .where('bank_id', bankId)
      .del();
  }
}