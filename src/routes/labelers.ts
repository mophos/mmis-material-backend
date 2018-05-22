'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { LabelerModel } from '../models/labeler';
import { OrganizationModel } from '../models/organization';

import warp = require('co-express');

const router = express.Router();

const labelerModel = new LabelerModel();
const organizationModel = new OrganizationModel();

router.get('/', (req, res, next) => {
  let db = req.db;

  labelerModel.list(db)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error.message })
    })
    .finally(() => {
      db.destroy();
    });
});

router.get('/bank', (req, res, next) => {
  let db = req.db;
  let labelerId = req.query.labelerId;

  labelerModel.getBank(db, labelerId)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error.message })
    })
    .finally(() => {
      db.destroy();
    });
});

router.post('/bank', (req, res, next) => {
  let db = req.db;
  let data = req.body.data;

  labelerModel.saveBank(db, data)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error.message })
    })
    .finally(() => {
      db.destroy();
    });
});

router.put('/bank', (req, res, next) => {
  let db = req.db;
  let bankId = req.query.bankId;
  let data = req.body.data;

  labelerModel.updateBank(db, bankId, data)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error.message })
    })
    .finally(() => {
      db.destroy();
    });
});

router.delete('/bank', (req, res, next) => {
  let db = req.db;
  let bankId = req.query.bankId;
  labelerModel.removeBank(db, bankId)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error.message })
    })
    .finally(() => {
      db.destroy();
    });
});

router.get('/search', warp(async (req, res, next) => {
  let db = req.db;
  const query = req.query.query;

  try {
    const rs = await labelerModel.search(db, query);
    res.send(rs);
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.get('/search-autocomplete', warp(async (req, res, next) => {
  const db = req.db;
  const query = req.query.q;
  const type = req.query.type;

  try {
    const rs = await labelerModel.searchAutoComplete(db, query, type);
    if (rs.length) {
      res.send(rs);
    } else {
      res.send([]);
    }
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.post('/', async (req, res, next) => {
  let labeler: any = req.body.labeler;
  let org: any = req.body.organization;

  let labelerData: any = {
    labeler_code: labeler.labelerCode,
    labeler_name: labeler.labelerName,
    labeler_name_po: labeler.labelerNamePo,
    short_code: labeler.labelerShortCode,
    description: labeler.labelerDescription,
    nin: labeler.labelerNin,
    labeler_type: labeler.labelerTypeId,
    labeler_status: labeler.labelerStatusId,
    disable_date: labeler.labelerDisableDate,
    address: labeler.labelerAddress,
    tambon_code: labeler.labelerTambon,
    ampur_code: labeler.labelerAmpur,
    province_code: labeler.labelerProvince,
    zipcode: labeler.labelerZipCode,
    phone: labeler.labelerPhone,
    url: labeler.labelerUrl,
    moph_labeler_id: labeler.labelerMophId,
    register_date: labeler.labelerRegisterDate,
    org_no: labeler.orgNo,
    country_code: labeler.orgCountry,
    fda_no: labeler.orgFADNumber,
    latitude: labeler.orgLatitude,
    longitude: labeler.orgLongitude,
    year_established: labeler.orgYearEstablished,
    year_register: labeler.orgYearRegister
  }

  let donatorsData: any = {
    donator_name: labeler.labelerName,
    short_code: labeler.labelerShortCode,
    donator_address: labeler.labelerAddress,
    donator_telephone: labeler.labelerPhone,
  }

  let db = req.db;

  if (labeler.labelerName) {
    try {
      await labelerModel.save(db, labelerData);
      await labelerModel.saveDonators(db, donatorsData);
      res.send({ ok: true });
    } catch (error) {
      console.log(error);
      res.send({ ok: false, error: error.message });
    } finally {
      db.destroy();
    }
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' }) ;
  }
});

router.put('/', async (req, res, next) => {
  let labeler: any = req.body.labeler;
  let org: any = req.body.organization;

  let labelerId = labeler.labelerId;

  let labelerData: any = {
    labeler_name: labeler.labelerName,
    labeler_name_po: labeler.labelerNamePo,
    short_code: labeler.labelerShortCode,
    description: labeler.labelerDescription,
    nin: labeler.labelerNin,
    labeler_type: labeler.labelerTypeId,
    labeler_status: labeler.labelerStatusId,
    disable_date: labeler.labelerDisableDate,
    address: labeler.labelerAddress,
    tambon_code: labeler.labelerTambon,
    ampur_code: labeler.labelerAmpur,
    province_code: labeler.labelerProvince,
    zipcode: labeler.labelerZipCode,
    phone: labeler.labelerPhone,
    url: labeler.labelerUrl,
    org_no: labeler.orgNo,
    country_code: labeler.orgCountry,
    fda_no: labeler.orgFADNumber,
    latitude: labeler.orgLatitude,
    longitude: labeler.orgLongitude,
    year_established: labeler.orgYearEstablished,
    year_register: labeler.orgYearRegister,
    is_vendor: labeler.isVendor,
    is_manufacturer: labeler.isManufacturer
  }

  let donatorsData: any = {
    donator_name: labeler.labelerName,
    donator_address: labeler.labelerAddress,
    donator_telephone: labeler.labelerPhone,
  }

  let db = req.db;

  if (labeler.labelerName) {

    try {
      await labelerModel.update(db, labelerId, labelerData);
      await labelerModel.updateDonators(db, donatorsData.donator_name, donatorsData);
      res.send({ ok: true })
    } catch (error) {
      console.log(error);
      res.send({ ok: false, error: error.message })
    } finally {
      db.destroy();
    }
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' }) ;
  }
});

router.get('/:labelerId/info', async (req, res, next) => {
  let labelerId = req.params.labelerId;
  let db = req.db;
  let labeler: any;

  if (labelerId) {
    try {
      let rs: any = await labelerModel.detail(db, labelerId);
      res.send({ ok: true, labeler: rs[0] });
    } catch (error) {
      console.log(error);
      res.send({ ok: false, error: error.message })
    } finally {
      db.destroy();
    }
  } else {
    res.send({ ok: false, error: 'ไม่พบรหัส Labeler' })
  }

});

router.delete('/:labelerId', (req, res, next) => {
  let labelerId = req.params.labelerId;
  let db = req.db;

  labelerModel.remove(db, labelerId)
    .then(() => {
      return organizationModel.remove(db, labelerId)
    })
    .then(() => {
      res.send({ ok: true })
    })
    .catch(error => {
      console.log(error);
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.post('/mcd-map', (req, res, next) => {
  let labelerId = req.body.labelerId;
  let mcdLabelerId = req.body.mcdLabelerId;

  let db = req.db;
  if (labelerId && mcdLabelerId) {

    labelerModel.saveRegisterMCD(db, labelerId, mcdLabelerId)
      .then(() => {
        res.send({ ok: true })
      })
      .catch(error => {
        console.log(error);
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ' });
  }
});

export default router;