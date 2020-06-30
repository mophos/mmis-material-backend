'use strict';

import * as express from 'express';
import * as crypto from 'crypto';

import { IConnection } from 'mysql';
import { Jwt } from '../models/jwt';
import { LoginModel } from '../models/login';

const router = express.Router();
const jwt = new Jwt();
const loginModel = new LoginModel();

router.post('/', (req, res, next) => {
  let username: any = req.body.username;
  let password: any = req.body.password;

  if (username && password) {
    let encPassword = crypto.createHash('md5').update(password).digest('hex');
    let db = req.db;
    loginModel.doLogin(db, username, encPassword)
      .then((results: any) => {
        if (results.length) {
          const payload = { fullname: results[0].fullname, employeeCode: results[0].employee_code };
          const token = jwt.sign(payload);
          res.send({ ok: true, token: token })
        } else {
          res.send({ ok: false, message: 'ชื่อผู้ใช้งานหรือรหัสผ่าน ไม่ถูกต้อง' })
        }
      })
      .catch(err => {
        console.log(err);
        res.send({ ok: false, message: 'Server error!' });
      })
      .finally(() => {
        db.destroy();
      });
      
  } else {
    res.send({ ok: false, message: 'กรุณาระบุชื่อผู้ใช้งานและรหัสผ่าน' })
  }
})

export default router;