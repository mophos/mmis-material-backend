import { MappingModel } from '../models/mapping';
import * as express from 'express';
import * as moment from 'moment';

import * as wrap from 'co-express';

const router = express.Router();

const mappingModel = new MappingModel();

router.get('/', wrap(async (req, res, next) => {
  const db = req.db;
  const productId = req.query.productId;

  try {
    const results = await mappingModel.getMappings(db, productId)
    res.send({ ok: true, rows: results[0] });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));

router.post('/', wrap(async (req, res, next) => {
  const db = req.db;
  const productId = req.body.productId;
  const data = req.body.data;

  try {
    const results = await mappingModel.saveMappings(db, productId, data)
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  } finally {
    db.destroy();
  }
}));



router.get('/search/tmt-code', async (req, res, next) => {

  let db = req.db;
  const query = req.query.q;

  try {
    let rs: any = await mappingModel.searchTmtCode(db, query);
    if (rs.length) {
      let items = [];
      rs.forEach(v => {
        let obj: any = {};
        obj.fsn = v.FSN;
        obj.tmtid = v.TMTID;
        items.push(obj);
      });
      res.send(items);
    } else {
      res.send([]);
    }
  } catch (error) {
    console.log(error);
    res.send([]);
  } finally {
    db.destroy();
  }

});
export default router;
