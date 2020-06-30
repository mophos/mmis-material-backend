import * as express from 'express';
import * as moment from 'moment';
import { MinMaxGroupModel } from '../models/minmax-groups';

const router = express.Router();

const minMaxGroupModel = new MinMaxGroupModel();

router.get('/', (req, res, next) => {
  let deleted: any = req.query.deleted == 'false' ? false : true;
  let db = req.db;

  minMaxGroupModel.list(db, deleted)
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
  let minMaxGroupName: any = req.body.minMaxGroupName;
  let minMaxGroupCal = +req.body.minMaxGroupCal;
  let maxSafety = +req.body.maxSafety;
  let minSafety = +req.body.minSafety;
  let db = req.db;

  if (minMaxGroupName) {
    let datas: any = {
      group_name: minMaxGroupName,
      used_day: minMaxGroupCal,
      safety_max_day: maxSafety,
      safety_min_day: minSafety
    }

    minMaxGroupModel.save(db, datas)
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.put('/:minMaxGroupId', (req, res, next) => {
  let minMaxGroupId = req.params.minMaxGroupId;
  let minMaxGroupName: any = req.body.minMaxGroupName;
  let minMaxGroupCal = +req.body.minMaxGroupCal;
  let maxSafety = +req.body.maxSafety;
  let minSafety = +req.body.minSafety;

  let db = req.db;

  if (minMaxGroupId) {
    let datas: any = {
      group_name: minMaxGroupName,
      used_day: minMaxGroupCal,
      safety_max_day: maxSafety,
      safety_min_day: minSafety
    }

    minMaxGroupModel.update(db, minMaxGroupId, datas)
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
    res.send({ ok: false, error: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.get('/detail/:minMaxGroupId', (req, res, next) => {
  let minMaxGroupId = req.params.minMaxGroupId;
  let db = req.db;

  minMaxGroupModel.detail(db, minMaxGroupId)
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
router.delete('/re-deleted', (req, res, next) => {
  let minMaxGroupId: any = req.query.id;
  let db = req.db;

  minMaxGroupModel.reRemove(db, minMaxGroupId)
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
router.delete('/:minMaxGroupId', (req, res, next) => {
  let minMaxGroupId = req.params.minMaxGroupId;
  let db = req.db;

  minMaxGroupModel.remove(db, minMaxGroupId)
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