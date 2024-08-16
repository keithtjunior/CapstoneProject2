'use strict';

/** Routes for faunae **/

const express = require('express');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');

const Fauna = require('../models/fauna');
const faunaePlaceSearchSchema = require('../schemas/faunaePlaceSearch.json');
const faunaeSearchSchema = require('../schemas/faunaeSearch.json');
const faunaSearchSchema = require('../schemas/faunaSearch.json');
const faunaeContinentSearchSchema = require('../schemas/faunaeContinentSearch.json');

const router = express.Router({ mergeParams: true });

/** GET / =>
 *  { name: name }
 *  Authorization required: none
**/
router.get('/', async function (req, res, next) {
  const q = req.query;
    try {
      const validator = jsonschema.validate(q, faunaeSearchSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      const results = await Fauna.findAll(q.species);
      return res.json({ results });
    } catch (err) {
      return next(err);
    }
});

/** GET /:id =>
 *  { id: id }
 *  Authorization required: none
**/
router.get('/:id(\\d+)', async function (req, res, next) {
  const params = req.params;
  try {
    const validator = jsonschema.validate({id: parseInt(params.id)}, faunaSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const results = await Fauna.get(params.id);
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
    const validator = jsonschema.validate(q, faunaeSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const results = await Fauna.findAllAuto(q.species);
    return res.json({ results });
  } catch (err) {
    return next(err);
  }
});

/** GET /continent =>
 *  name (string)
 *  Authorization required: none
**/
router.get('/continent', async function (req, res, next) {
  const q = req.query;
  const arr = Object.values(q);
  try {
    const validator = jsonschema.validate(q, faunaeContinentSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const results = await Fauna.getByContinent(arr);
    return res.json({ results });
  } catch (err) {
    return next(err);
  }
});

/** GET /place =>
 *  { name: name }
 *  Authorization required: none
**/
router.get('/place', async function (req, res, next) {
  const q = req.query;
    try {
      let query = {
        'lat': Number(q.lat),
        'lng': Number(q.lng),
        'place_ids': Array.isArray(q.place_ids) ? q.place_ids : q.place_ids.slice(1,-1).split(','),
        'per_page': q.per_page,
        'radius': q.radius
      }
      const validator = jsonschema.validate(query, faunaePlaceSearchSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
      const results = await Fauna.findByPlace(query.lat, query.lng, query.radius, query.place_ids, query.per_page);
      return res.json({ results });
    } catch (err) {
      return next(err);
    }
});

/** GET /observation/:id =>
 *  { id: id }
 *  Authorization required: none
**/
router.get('/observations/:id(\\d+)', async function (req, res, next) {
  const params = req.params;
  try {
    const validator = jsonschema.validate({id: parseInt(params.id)}, faunaSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const results = await Fauna.getByObservation(params.id);
    return res.json({ results });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;