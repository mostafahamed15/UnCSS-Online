var express = require('express');
var router = express.Router();
var uncss = require('uncss');
var fs = require('fs');
var multer  = require('multer');
var upload = multer();
var uuid = require('node-uuid');

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', {
    title: 'UnCSS Online!'
  });
});

router.post('/uncss', upload.array(), function(req, res) {

  var name = uuid.v1();

  fs.writeFileSync('temp/' + name + '.html', req.body.inputHtml);
  fs.writeFileSync('temp/' + name + '.css', req.body.inputCss);

  uncss(['temp/' + name + '.html'], {
    stylesheets: [name + '.css']
  }, function(error, output) {
    if (req.body.type === 'fetch') {
      res.json({
        outputCss: output,
        error: error
      });
    }
    else {
      res.render('index', {
        title: 'UnCSS Online!',
        inputHtml: req.body.inputHtml,
        inputCss: req.body.inputCss,
        outputCss: output,
        error: error
      });
    }

    fs.unlink('temp/' + name + '.html');
    fs.unlink('temp/' + name + '.css');
  });
});

module.exports = router;