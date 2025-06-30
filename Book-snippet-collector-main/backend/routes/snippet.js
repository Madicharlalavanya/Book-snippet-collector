const express = require('express');
const router = express.Router();
const { createSnippet, getSnippets, getRandomSnippet } = require('../controllers/snippetController'); // ✨ IMPORT NEW FUNCTION
const { ensureAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); // ✨ IMPORT MULTER



router.get('/random', ensureAuthenticated, getRandomSnippet);

router.route('/')
  .get(ensureAuthenticated, getSnippets)
  .post(ensureAuthenticated, upload.single('snippetImage'), createSnippet);
module.exports = router;