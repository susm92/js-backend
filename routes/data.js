const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.js');
const data = require("../models/data.js");

router.get('/:username',
    authenticateToken,
    (req, res) => data.getAllDocuments(res, req, req.params.username)
);

router.get('/:id',
    authenticateToken,
    (req, res) => data.getSpecificDocument(res, req, req.params.id)
);

router.put('/share',
    authenticateToken,
    (req, res) => data.updateSharedData(res, req)
);

router.post('/',
    authenticateToken,
    (req, res) => data.createData(res, req)
);

router.put('/',
    authenticateToken,
    (req, res) => data.updateData(res, req)
);

router.delete('/',
    authenticateToken,
    (req, res) => data.deleteData(res, req)
);

module.exports = router;
