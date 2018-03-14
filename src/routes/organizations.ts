'use strict';

import * as express from 'express';
import * as moment from 'moment';
import { unitOfTime } from 'moment';

import { OrganizationModel } from '../models/organization';
const router = express.Router();

const organizationModel = new OrganizationModel();

router.get('/', (req, res, next) => {
  let limit = req.body.limit || 10;
  let offset = req.body.offset || 0;

  let db = req.db;

  organizationModel.list(db, limit, offset)
    .then((results: any) => {
      res.send({ ok: true, rows: results });
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.post('/', (req, res, next) => {
  let labelerId = req.body.labelerId;
  let orgNo = req.body.orgNo;
  let yearRegister = req.body.yearRegister;
  let yearEstablished = req.body.yearEstablished;
  let country = req.body.country;
  let fadNumber = req.body.fadNumber;
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;

  let db = req.db;

  if (labelerId) {
    let datas: any = {
      labeler_id: labelerId,
      org_no: orgNo,
      year_register: yearRegister,
      year_established: yearEstablished,
      country: country,
      fad_number: fadNumber,
      longitude: longitude,
      latitude: latitude
    }

    organizationModel.save(db, datas)
      .then((results: any) => {
        res.send({ ok: true })
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' }) ;
  }
});

router.put('/:labelerId', (req, res, next) => {
  let labelerId = req.body.labelerId;
  let orgNo = req.body.orgNo;
  let yearRegister = req.body.yearRegister;
  let yearEstablished = req.body.yearEstablished;
  let country = req.body.country;
  let fadNumber = req.body.fadNumber;
  let latitude = req.body.latitude;
  let longitude = req.body.longitude;

  let db = req.db;

  if (labelerId) {
    let datas: any = {
      org_no: orgNo,
      year_register: yearRegister,
      year_established: yearEstablished,
      country: country,
      fad_number: fadNumber,
      longitude: longitude,
      latitude: latitude
    }

    organizationModel.update(db, labelerId, datas)
      .then((results: any) => {
        res.send({ ok: true })
      })
      .catch(error => {
        res.send({ ok: false, error: error })
      })
      .finally(() => {
        db.destroy();
      });
  } else {
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' }) ;
  }
});

router.get('/detail/:labelerId', (req, res, next) => {
  let labelerId = req.params.labelerId;
  let db = req.db;

  organizationModel.detail(db, labelerId)
    .then((results: any) => {
      res.send({ ok: true, detail: results[0] })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

router.delete('/:labelerId', (req, res, next) => {
  let labelerId = req.params.labelerId;
  let db = req.db;

  organizationModel.remove(db, labelerId)
    .then((results: any) => {
      res.send({ ok: true })
    })
    .catch(error => {
      res.send({ ok: false, error: error })
    })
    .finally(() => {
      db.destroy();
    });
});

export default router;