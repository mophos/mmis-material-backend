'use strict';

import * as express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/version',(req,res,next) => {
  res.send({version: '1.0.0', build: '201706071800'});
});

export default router;