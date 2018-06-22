import Knex = require('knex');
import * as moment from 'moment';

export class DrugGroupModel {
  list(knex: Knex) {
    return knex('mm_generic_groups')
      .where('is_deleted', 'N')
      .where('is_active', 'Y')
      .orderBy('group_name');
  }


  listAll(knex: Knex) {
    let sql = `
      SELECT
      RPAD(
        concat(
        IF
          ( g1.group_code_1 IS NOT NULL, g1.group_code_1, '' ),
        IF
          ( g2.group_code_2 IS NOT NULL, g2.group_code_2, '' ),
        IF
          ( g3.group_code_3 IS NOT NULL, g3.group_code_3, '' ),
        IF
          ( g4.group_code_4 IS NOT NULL, g4.group_code_4, '' ) 
        ),
        8,
        0 
      ) AS group_code_full,
      g1.group_code_1,
      g1.group_name_1,
      g2.group_code_2,
      g2.group_name_2,
      g3.group_code_3,
      g3.group_name_3,
      g4.group_code_4,
      g4.group_name_4,
      CONCAT(
      IF
        ( g1.group_name_1 IS NOT NULL, g1.group_name_1, '' ),
      IF
        ( g2.group_name_2 IS NOT NULL, concat( ' - ', g2.group_name_2 ), '' ),
      IF
        ( g3.group_name_3 IS NOT NULL, concat( ' - ', g3.group_name_3 ), '' ),
      IF
        ( g4.group_name_4 IS NOT NULL, concat( ' - ', g4.group_name_4 ), '' ) 
      ) AS group_name_full 
    FROM
      mm_generic_group_1 g1
      LEFT JOIN mm_generic_group_2 g2 ON g1.group_code_1 = g2.group_code_1
      LEFT JOIN mm_generic_group_3 g3 ON g2.group_code_2 = g3.group_code_2 
      AND g2.group_code_1 = g3.group_code_1
      LEFT JOIN mm_generic_group_4 g4 ON g3.group_code_3 = g4.group_code_3 
      AND g4.group_code_2 = g2.group_code_2 
      AND g4.group_code_1 = g1.group_code_1 
      
    ORDER BY
      g1.group_code_1,
      g2.group_code_2,
      g3.group_code_3,
      g4.group_code_4`;
    return knex.raw(sql);
  }

  // ############## GROUP 1 #####################
  group1(knex: Knex, isActived = 'Y') {
    let sql = knex('mm_generic_group_1')
      .where('is_deleted', 'N')
    if (isActived != 'A') {
      sql.where('is_actived', isActived)
    }
    sql.orderBy('group_code_1');
    return sql;
  }

  saveGroup1(knex: Knex, datas: any) {
    return knex('mm_generic_group_1')
      .insert(datas);
  }

  updateGroup1(knex: Knex, groupCode1: string, groupName1: string) {
    return knex('mm_generic_group_1')
      .where('group_code_1', groupCode1)
      .update('group_name_1', groupName1);
  }

  activeGroup1(knex: Knex, groupId: any, status) {
    return knex('mm_generic_group_1')
      .where('group_code_1', groupId)
      .update('is_actived', status);
  }

  removeGroup1(knex: Knex, groupCode1: string) {
    return knex('mm_generic_group_1')
      .where('group_code_1', groupCode1)
      .update('is_deleted', 'Y')
  }
  // ################################################
  // ############## GROUP 2 #####################
  group2(knex: Knex, isActived = 'Y') {
    let sql = knex('mm_generic_group_2 as g2')
      .select('g2.is_actived', 'g1.group_code_1', 'g2.group_code_2', 'g1.group_name_1', 'g2.group_name_2', knex.raw('concat(g1.group_name_1,g2.group_name_2)  as full_name'), knex.raw('concat(g1.group_code_1,g2.group_code_2)  as full_code'))
      .join('mm_generic_group_1 as g1', 'g1.group_code_1', 'g2.group_code_1')
      .where('g1.is_deleted', 'N')
      .where('g2.is_deleted', 'N')
      .where('g1.is_actived', 'Y')
    if (isActived != 'A') {
      sql.where('g2.is_actived', isActived)
    }
    sql.orderBy('g1.group_code_1');
    sql.orderBy('g2.group_code_2');
    return sql;
  }

  saveGroup2(knex: Knex, datas: any) {
    return knex('mm_generic_group_2')
      .insert(datas);
  }

  updateGroup2(knex: Knex, groupCode1: string, groupCode2: string, groupName2: string) {
    return knex('mm_generic_group_2')
      .where('group_code_1', groupCode1)
      .where('group_code_2', groupCode2)
      .update('group_name_2', groupName2);
  }

  activeGroup2(knex: Knex, groupCode1: string, groupCode2: string, status) {
    return knex('mm_generic_group_2')
      .where('group_code_1', groupCode1)
      .where('group_code_2', groupCode2)
      .update('is_actived', status);
  }

  removeGroup2(knex: Knex, groupCode1: string, groupCode2: string) {
    return knex('mm_generic_group_2')
      .where('group_code_1', groupCode1)
      .where('group_code_2', groupCode2)
      .update('is_deleted', 'Y')
  }
  // ############## GROUP 3 #####################
  group3(knex: Knex, isActived = 'Y') {
    let sql = knex('mm_generic_group_3 as g3')
      .select('g3.is_actived', 'g1.group_code_1', 'g2.group_code_2', 'g3.group_code_3', 'g1.group_name_1', 'g2.group_name_2', 'g3.group_name_3', knex.raw('concat(g1.group_name_1,g2.group_name_2,g3.group_name_3)  as full_name'), knex.raw('concat(g1.group_code_1,g2.group_code_2,g3.group_code_3)  as full_code'))
      .joinRaw('join mm_generic_group_2 as g2 on g2.group_code_2=g3.group_code_2 and g3.group_code_1 = g2.group_code_1')
      .join('mm_generic_group_1 as g1', 'g1.group_code_1', 'g2.group_code_1')
      .where('g1.is_deleted', 'N')
      .where('g2.is_deleted', 'N')
      .where('g3.is_deleted', 'N')
      .where('g1.is_actived', 'Y')
      .where('g2.is_actived', 'Y')
    if (isActived != 'A') {
      sql.where('g3.is_actived', isActived)
    }
    sql.orderBy('g1.group_code_1');
    sql.orderBy('g2.group_code_2');
    sql.orderBy('g3.group_code_3');
    return sql;
  }

  saveGroup3(knex: Knex, datas: any) {
    return knex('mm_generic_group_3')
      .insert(datas);
  }

  updateGroup3(knex: Knex, groupCode1: string, groupCode2: string, groupCode3: string, groupName3: string) {
    return knex('mm_generic_group_3')
      .where('group_code_1', groupCode1)
      .where('group_code_2', groupCode2)
      .where('group_code_3', groupCode3)
      .update('group_name_3', groupName3);
  }

  activeGroup3(knex: Knex, groupCode1: string, groupCode2: string, groupCode3: string, status) {
    return knex('mm_generic_group_3')
      .where('group_code_1', groupCode1)
      .where('group_code_2', groupCode2)
      .where('group_code_3', groupCode3)
      .update('is_actived', status);
  }

  removeGroup3(knex: Knex, groupCode1: string, groupCode2: string, groupCode3: string, ) {
    return knex('mm_generic_group_3')
      .where('group_code_1', groupCode1)
      .where('group_code_2', groupCode2)
      .where('group_code_3', groupCode3)
      .update('is_deleted', 'Y')
  }
  // ############## GROUP 4 #####################
  group4(knex: Knex, isActived = 'Y') {
    let sql = knex('mm_generic_group_4 as g4')
      .select('g4.is_actived', 'g1.group_code_1', 'g2.group_code_2', 'g3.group_code_3', 'g4.group_code_4', 'g1.group_name_1', 'g2.group_name_2', 'g3.group_name_3', 'g4.group_name_4', knex.raw('concat(g1.group_name_1,g2.group_name_2,g3.group_name_3,g4.group_name_4)  as full_name'), knex.raw('concat(g1.group_code_1,g2.group_code_2,g3.group_code_3,g4.group_code_4)  as full_code'))
      .joinRaw('join mm_generic_group_3 as g3 on g4.group_code_3=g3.group_code_3 and g4.group_code_2=g3.group_code_2 and g3.group_code_1 = g4.group_code_1')
      .joinRaw('join mm_generic_group_2 as g2 on g2.group_code_2=g4.group_code_2 and g4.group_code_1 = g2.group_code_1')
      .join('mm_generic_group_1 as g1', 'g1.group_code_1', 'g2.group_code_1')
      .where('g1.is_deleted', 'N')
      .where('g2.is_deleted', 'N')
      .where('g3.is_deleted', 'N')
      .where('g4.is_deleted', 'N')
      .where('g1.is_actived', 'Y')
      .where('g2.is_actived', 'Y')
      .where('g3.is_actived', 'Y')
    if (isActived != 'A') {
      sql.where('g4.is_actived', isActived)
    }
    sql.orderBy('g1.group_code_1');
    sql.orderBy('g2.group_code_2');
    sql.orderBy('g3.group_code_3');
    sql.orderBy('g4.group_code_4');
    console.log(sql.toString());
    
    return sql;
  }

  saveGroup4(knex: Knex, datas: any) {
    return knex('mm_generic_group_4')
      .insert(datas);
  }

  updateGroup4(knex: Knex, groupCode1: string, groupCode2: string, groupCode3: string, groupCode4: string, groupName4: string) {
    return knex('mm_generic_group_4')
      .where('group_code_1', groupCode1)
      .where('group_code_2', groupCode2)
      .where('group_code_3', groupCode3)
      .where('group_code_4', groupCode4)
      .update('group_name_4', groupName4);
  }

  activeGroup4(knex: Knex, groupCode1: string, groupCode2: string, groupCode3: string, groupCode4: string, status) {
    return knex('mm_generic_group_4')
      .where('group_code_1', groupCode1)
      .where('group_code_2', groupCode2)
      .where('group_code_3', groupCode3)
      .where('group_code_4', groupCode4)
      .update('is_actived', status);
  }

  removeGroup4(knex: Knex, groupCode1: string, groupCode2: string, groupCode3: string, groupCode4: string ) {
    return knex('mm_generic_group_4')
      .where('group_code_1', groupCode1)
      .where('group_code_2', groupCode2)
      .where('group_code_3', groupCode3)
      .where('group_code_4', groupCode4)
      .update('is_deleted', 'Y')
  }
}