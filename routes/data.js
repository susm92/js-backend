const express = require('express');
const router = express.Router();

const data = require("../models/data.js");

router.get('/',
    (req, res) => data.getAllDocuments(res, req)
);

router.get('/:id',
    (req, res) => data.getSpecificDocument(res, req, req.params.id)
);

router.post('/',
    (req, res) => data.createData(res, req)
);

router.put('/',
    (req, res) => data.updateData(res, req)
);

router.delete('/',
    (req, res) => data.deleteData(res, req)
);

module.exports = router;
