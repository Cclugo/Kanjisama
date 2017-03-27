var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;



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