'use strict';

/** Routes for location **/

const express = require('express');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');

const Location = require('../models/location');
const locationSearchSchema = require('../schemas/locationSearch.json');
const locationsSearchSchema = require('../schemas/locationsSearch.json');
const locationIdSearchSchema = require('../schemas/locationIdSearch.json');
const locationAutoSearchSchema = require('../schemas/locationAutoSearch.json');

const router = express.Router({ mergeParams: true });

/** GET / =>
 *  { location: {} }
 *  Authorization required: none
**/
router.get('/', async function (req, res, next) {
    const q = req.query;
    let data = Object.keys(q).reduce((acc,rec) => {
      acc[rec] = Number(q[rec])
      return acc}, {});
    try {
      const validator = jsonschema.validate(data, locationsSearchSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      const results = await Location.findAll(data);
      return res.json({ results });
    } catch (err) {
      return next(err);
    }
});

/** GET /:id =>
 *  id (integer)
 *  Authorization required: none
**/
router.get('/:id(\\d+)', async function (req, res, next) {
  const id = req.params.id;
  try {
    const validator = jsonschema.validate({'id': Number(id)}, locationIdSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const results = await Location.getById(id);
    return res.json({ results });
  } catch (err) {
    return next(err);
  }
});

/** GET /name =>
 *  name (string)
 *  Authorization required: none
**/
router.get('/name', async function (req, res, next) {
  const q = req.query;
  let query = {
    name: q.name,
    nelat: Number(q.nelat),
    nelng: Number(q.nelng),
    swlat: Number(q.swlat),
    swlng: Number(q.swlng)
  };
  try {
    const validator = jsonschema.validate(query, locationSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const results = await Location.get(query);
    return res.json({ results });
  } catch (err) {
    return next(err);
  }
});

/** GET /auto =>
 *  name (string)
 *  Authorization required: none
**/
router.get('/auto', async function (req, res, next) {
  const q = req.query;
  try {
    const validator = jsonschema.validate(q, locationAutoSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const results = await Location.getByTerm(q.term);
    return res.json({ results });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;