import 'ol/ol.css';
//import 'javascript-autocomplete/auto-complete.css'; //additional includes für UE4
// import View from 'ol/view';
//import Map from 'ol/map';
// import TileLayer from 'ol/layer/tile';
// import Stamen from 'ol/source/stamen';
import VectorLayer from 'ol/layer/vector';
import Vector from 'ol/source/vector';
//import VectorSource from 'ol/source/vector';
import GeoJSON from 'ol/format/geojson';
import Style from 'ol/style/style';
//import IconStyle from 'ol/style/icon';
import Circle from 'ol/style/circle'; //ueberfluessiges include aus UE3
//import Text from 'ol/style/text';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import proj from 'ol/proj';
import {
  apply
} from 'ol-mapbox-style';
//import AutoComplete from 'javascript-autocomplete'; //additional includes für UE4
import Overlay from 'ol/overlay';
//import coordinate from 'ol/coordinate';
//import {ValidCaptcha} from './captcha.js';
//import {Captcha} from './captcha.js';


function validateForm() {
  var name = document.forms['geowebInsert']['name'].value;
  var email = document.forms['geowebInsert']['email'].value;
  var place = document.forms['geowebInsert']['place'].value;  
  if (name == '') {
    alert('Name ist Pflichtfeld!');
    return false;
  } else if (email == '') {
    alert('Email ist Pflichtfeld!');
    return false;
  } else if (place == '') {
    alert('Ort ist Pflichtfeld!');
    return false;
  }
}

const map = apply(
  'map',
  'style.json'
);

var overlay = new Overlay({
  id: 'info',
  element: document.getElementById('popup-container'),
  positioning: 'bottom-center',
  offset: [0, -10]
});
var overlay2 = new Overlay({
  id: 'insertForm',
  element: document.getElementById('popup-container2'),
  positioning: 'bottom-center',
  offset: [0, -10]
});
map.addOverlay(overlay);
map.addOverlay(overlay2);

function removeForm() {
  overlay2.setPosition();
}

const bezirkeLayer = new VectorLayer({
  source: new Vector({
    url: 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BEZIRKSGRENZEOGD&srsName=EPSG:4326&outputFormat=json',
    format: new GeoJSON()
  }),
  zIndex: 2
});
map.addLayer(bezirkeLayer);

const ruheLayer = new VectorLayer({
  source: new Vector({
    url: 'https://student.ifip.tuwien.ac.at/geoweb/2017/g07/map/postgis_li_geojson.php?type=R',
    format: new GeoJSON()
  }),
  zIndex: 3
});
map.addLayer(ruheLayer);

const laermLayer = new VectorLayer({
  source: new Vector({
    url: 'https://student.ifip.tuwien.ac.at/geoweb/2017/g07/map/postgis_li_geojson.php?type=L',
    format: new GeoJSON()
  }),
  zIndex: 3
});
map.addLayer(laermLayer);

ruheLayer.setStyle(function(feature) {
  return new Style({
    image: new Circle({
      radius: 7,
      fill: new Fill({
        color: 'rgba(12, 232, 12, 1)'
      }),
      stroke: new Stroke({
        color: 'rgba(127, 127, 127, 1)',
        width: 1
      })
    })
  });
});

laermLayer.setStyle(function(feature) {
  return new Style({
    image: new Circle({
      radius: 7,
      fill: new Fill({
        color: 'rgba(232, 12, 12, 1)'
      }),
      stroke: new Stroke({
        color: 'rgba(127, 127, 127, 1)',
        width: 1
      })
    })
  });
});

// var form = document.getElementById('geowebInsert');
// document.getElementById('chkAndSend').addEventListener('singleclick', function() {
//   if (ValidCaptcha()) {
//     form.submit();
//   }
//
// });


map.on('singleclick', function(e) {
  var markup = '';
  map.forEachFeatureAtPixel(e.pixel, function(feature) {
    var properties = feature.getProperties();
    markup += `${markup && '<hr>'}<table>`;
    for (var property in properties) {
      if (property != 'geometry') {
        markup += `<tr><th>${property}</th><td>${properties[property]}</td></tr>`;
      }
    }
    markup += '</table>';
  }, {
    layerFilter: (l) => l === ruheLayer || l === laermLayer
  });
  if (markup) {
    document.getElementById('popup-content').innerHTML = markup;
    overlay.setPosition(e.coordinate);
    overlay2.setPosition();
  } else {
    overlay.setPosition();
    overlay2.setPosition();
    var pos = proj.toLonLat(e.coordinate);
    //ALTER AUFRUF EXTERNE SEITE
    //window.location.href =
    //  'https://student.ifip.tuwien.ac.at/geoweb/2017/g07/php/insert_point.php?pos=' +
    //  pos.join(' ');
    //TEST AUFRUF
    //markup += `${markup && '<hr>'}<p>TEST Pos:${pos.join(' ')}</p>`;
    // NEUER AUFRUF POPUP MARKUP
    markup += `${markup && '<hr>'}`;
    markup += '<h2>Ruheoase oder Lärmort</h2>';
    markup += '<p class="footnote"><font color="red">* Pflichtfeld</font></p>';
    markup += `<form class="content" id="geowebInsert" onreset="return removeForm();" onsubmit="return validateForm();" method="POST" action="https://student.ifip.tuwien.ac.at/geoweb/2017/g07/php/insert_point.php?pos=${pos.join(' ')}">`;
    markup += '         <fieldset>';
    markup += '  <input class="content" type="radio" id="laerm1" name="laerm" value="R" checked="checked">';
    markup += '  <label class="content" for="laerm1">Ruheoase</label>';
    markup += '  <input class="content" type="radio" id="laerm2" name="laerm" value="L">';
    markup += '  <label class="content" for="laerm2">Lärmzone</label>';
    markup += '</fieldset>';//'<p style="color:red">*</p>';
    markup += '<fieldset>';
    markup += '  <input class="content" type="radio" id="privacat1" name="privcat" value="1" checked="checked">';
    markup += '  <label class="content" for="privacat1">öffentlich</label>';
    markup += '    <input class="content" type="radio" id="privacat2" name="privcat" value="2">';
    markup += '    <label class="content" for="privacat2">halböffentlich</label>';
    markup += '  <input class="content" type="radio" id="privacat3" name="privcat" value="3">';
    markup += '  <label class="content" for="privacat3">privat</label>';
    markup += '  </fieldset>';//'<p style="color:red">*</p>';
    markup += '<table class="insertForm">';
    markup +=  '<tr><td>Name</td><td><input type="text" name="name" /><font color="red">*</font>(wird nicht angezeigt)</td></tr>';
    markup +=  '<tr><td>Email</td><td><input type="text" name="email" /><font color="red">*</font></td></tr>';
    markup +=  '<tr><td>Ort</td><td><input type="text" name="place" /><font color="red">*</font></td></tr>';
    markup +=  '<tr><td>Beschreibung</td><td><input type="text" name="desc" /></td></tr>';
    markup += ' <tr><td><input id ="cancel" type="reset" value="cancel"></td>';
    markup += ' <td><input type="submit" value="send"></td></tr></table></form>';

    //  markup += '  <div class="inputForm capt"><h3 type="text" id="mainCaptcha"></h3><br>';
    //  markup += '  <input class="inputForm" type="button" id="refresh" value="refresh" onclick="Captcha();"/><br>';
    //  markup += '  <input class="inputForm" type="text" name="txtInput" id="txtInput"/>';
    //  markup += '  <br><input class="inputForm" id="chkAndSend" type="button" value="send" onclick="CheckAndSend;"/>';  /*onclick="alert(ValidCaptcha());"*/
    //  markup += '  <br><input class="inputForm" id="cancel" type="reset" value="cancel" onclick="overlay2.setPosition();"/></div>';
    /*https://stackoverflow.com/questions/3196335/how-to-create-simple-javascript-jquery-client-side-captcha

    <div class="capt">
    <h2 type="text" id="mainCaptcha"></h2>
    <p><input type="button" id="refresh" onclick="Captcha();"/></p>
    <input type="text" id="txtInput"/>
    <input id="Button1" type="button" value="Check" onclick="alert(ValidCaptcha());"/>
    </div>
    */
    //markup += `  <input type="hidden" name="pos" value="${pos.join(' ')}">`; //WENN WIRS ALS POST VARIABLE SCHICKEN WOLLEN - ABER NET NOTWENDIG
    //markup += '  </form></td></tr></table>';
    //MARKUP ANZEIGEN
    document.getElementById('popup-content2').innerHTML = markup;
    overlay2.setPosition(e.coordinate);

    (function() {
      var qs = function(s) {
          return document.querySelector(s);
        },
      form = qs('form');
      form.onsubmit = function(e) {
        return validateForm();
      };
      form.onreset = function(e) {
        return removeForm();
      };
    }());

    /*
    document.getElementById('refresh').addEventListener('singleclick', function() {
      Captcha();
    });

    document.getElementById('chkAndSend').addEventListener('singleclick', function() {
      if (ValidCaptcha()) {
        var form = document.getElementById('geowebInsert');
        form.submit();
      }
    });

    document.getElementById('cancel').addEventListener('singleclick', function() {
      var form = document.getElementById('geowebInsert');
      form.reset();
      overlay.setPosition();
      overlay2.setPosition();
    });
    */
  }
});

//ALTER SOURCECODE - vielleicht brauchma no ----------------------------------------------------------------------------------------
//ue4
//var onload, source;
// new AutoComplete({
//   selector: 'input[name="q"]',
//   source: function(term, response) {
//     if (onload) {
//       source.un('change', onload);
//     }
//     searchResult.setSource(null);
//     source = new VectorSource({
//       format: new GeoJSON(),
//       url: 'https://photon.komoot.de/api/?q=' + term
//     });
//     onload = function(e) {
//       var texts = source.getFeatures().map(function(feature) {
//         return getAddress(feature);
//       });
//       response(texts);
//       fit();
//     };
//     source.once('change', onload);
//     searchResult.setSource(source);
//   },
//   onSelect: function(e, term, item) {
//     selected = item.getAttribute('data-val');
//     source.getFeatures().forEach(function(feature) {
//       if (getAddress(feature) !== selected) {
//         source.removeFeature(feature);
//       }
//     });
//     fit();
//   }
// });

// UE4
// function fit() {
//   map.getView().fit(source.getExtent(), {
//     maxZoom: 19,
//     duration: 250
//   });
// }

// var selected;
//
// function getAddress(feature) {
//   var properties = feature.getProperties();
//   return (
//     (properties.city || properties.name || '') +
//     ' ' +
//     (properties.street || '') +
//     ' ' +
//     (properties.housenumber || '')
//   );
// }

/*suchfunktion UE4*/
// var searchResult = new VectorLayer({
//   zIndex: 3 //
// });
//
// map.addLayer(searchResult);
// searchResult.setStyle(new Style({
//   image: new IconStyle({
//     src: './data/marker1.png'
//   })
// }));
