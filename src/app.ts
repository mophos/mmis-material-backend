
require('dotenv').config();

import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as _ from 'lodash';

const protect = require('@risingstack/protect');

import Knex = require('knex');
import { MySqlConnectionConfig } from 'knex';

import { Jwt } from './models/jwt';
const jwt = new Jwt();

import indexRoute from './routes/index';
import genericMedicalSuppliesRoute from './routes/genericsMedicalSupplies';
import genericRoute from './routes/generics';
import labelerRoute from './routes/labelers';
import organizationRoute from './routes/organizations';
import pacakgeRoute from './routes/packages';
import productRoute from './routes/products';
import typeRoute from './routes/types';
import dosageRoute from './routes/drugDosages';
import drugTypeRoute from './routes/drugTypes';
import drugGroupRoute from './routes/drugGroups';
import suppliesTypeRoute from './routes/suppliesTypes';
import loginRoute from './routes/login';
import drugAccountRoute from './routes/drugAccounts';
import typeProduct from './routes/typeProduct';
import unitRoute from './routes/units';
import lotRoute from './routes/lots';
import userRoute from './routes/users';

import stdRoute from './routes/standardCode';

const app: express.Express = express();

//view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

let checkAuth = (req, res, next) => {
  let token: string = null;

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  } else {
    token = req.body.token;
  }

  jwt.verify(token)
    .then((decoded: any) => {
      req.decoded = decoded;
      let accessRight = decoded.accessRight;
      if (accessRight) {
        let rights = decoded.accessRight.split(',');
        if (_.indexOf(rights, 'MM_ADMIN') > -1) {
          next();
        } else {
          res.send({ ok: false, error: 'Permission denied!' });
        }
      } else {
        res.send({ ok: false, error: 'Permission denied!' });
      }
    }, err => {
      console.log(err);
      return res.send({
        ok: false,
        error: 'No token provided.',
        code: 403
      });
    });
}

let dbConnection: MySqlConnectionConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

app.use((req, res, next) => {
  req.db = Knex({
    client: 'mysql',
    connection: dbConnection,
    pool: {
      min: 0,
      max: 7,
      afterCreate: (conn, done) => {
        conn.query('SET NAMES utf8', (err) => {
          done(err, conn);
        });
      }
    },
    debug: true
  });
  next();
});

app.use('/login', loginRoute);
app.use('/generics', checkAuth, genericRoute);
app.use('/generics-medical-supplies', checkAuth, genericMedicalSuppliesRoute);
app.use('/labelers', checkAuth, labelerRoute);
app.use('/organizations', checkAuth, organizationRoute);
app.use('/packages', checkAuth, pacakgeRoute);
app.use('/products', checkAuth, productRoute);
app.use('/types', checkAuth, typeRoute);
app.use('/drug-dosages', checkAuth, dosageRoute);
app.use('/drug-types', checkAuth, drugTypeRoute);
app.use('/type-product', checkAuth, typeProduct);
app.use('/drug-groups', checkAuth, drugGroupRoute);
app.use('/drug-accounts', checkAuth, drugAccountRoute);
app.use('/supplies-types', checkAuth, suppliesTypeRoute);
app.use('/std', checkAuth, stdRoute);
app.use('/units', checkAuth, unitRoute);
app.use('/lots', checkAuth, lotRoute);
app.use('/users', checkAuth, userRoute);

app.use('/', indexRoute);

//catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err['status'] = 404;
  next(err);
});

app.use((err: Error, req, res, next) => {
  res.status(err['status'] || 500);
  res.send({ ok: false, error: err });
  console.log(err);
});

export default app;
