var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Kanjisama' });
});

/* Empty query. */
router.get('/query-data', function(req, res) {
  res.send('Campo vacio');
});

/* Proxy for Jisho.org API */
router.get('/proxy/:parametros', function(req, res, next) {
  var parametros = req.params.parametros;
  parametros = encodeURI(parametros)
  var url = "/api/v1/search/words?keyword="+parametros;
  
  var options = {
    host: 'jisho.org',
    path: '/api/v1/search/words?keyword='+parametros
  };
  callback = function(response) {
    var str = '';
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });
    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      res.send(str);
    });
  }
  http.request(options, callback).end();

});

/* GET table with info. */
router.get('/query-data/:parametros', function(req, res, next) {
  var connection = require('../database');
  var respRecibidas = 1; // counter of words in the search

  var parametros = req.params.parametros;
  var arrParam = parametros.split(";");
  var pagina = arrParam[1];
  var arrayTexto = arrParam[0].split(" ");

  var sqlCallback = function(err, results) {
    if ( err ) {
      // handle the error safely
      console.log('Database error, last query: '+queryTexto);
      console.log(err);
      console.log(err.code);
    } else if (!results.length) {
      console.log('Empty result at db query, last query: '+queryTexto);
      if (pagina == 0) {
        res.send('Sin coincidencias');
      } else {
        res.send('No hay más páginas');
      }
    } else {
      pagina = parseInt(pagina) + 1;
      res.render('tabla', {array: results, pagina: pagina});
    }
  }

  var queryTexto = "SELECT * FROM `kanji` WHERE (";
  for (var i = 0, len = arrayTexto.length; i < len; i++) {
    if (i > 0) { queryTexto += " AND ("; }
    queryTexto += "`palabra` LIKE '"+arrayTexto[i]+"%' ";
    queryTexto += "OR `comp1` LIKE '"+arrayTexto[i]+"%' ";
    queryTexto += "OR `comp2` LIKE '"+arrayTexto[i]+"%' ";
    queryTexto += "OR `comp3` LIKE '"+arrayTexto[i]+"%' ";
    queryTexto += "OR `comp4` LIKE '"+arrayTexto[i]+"%' ";
    queryTexto += "OR `comp5` LIKE '"+arrayTexto[i]+"%' ";
    queryTexto += "OR `comp6` LIKE '"+arrayTexto[i]+"%')";
  }
  queryTexto += " LIMIT "+pagina*5+", 5";

  connection.query(queryTexto, sqlCallback);
  
});

module.exports = router;