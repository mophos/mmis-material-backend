
import * as express from 'express';
import * as moment from 'moment';
import * as wrap from 'co-express';

import { MinMaxModel } from '../models/minmax';
const router = express.Router();

const minmaxModel = new MinMaxModel();


export default router;