import 'ol/ol.css';
//import 'javascript-autocomplete/auto-complete.css'; //additional includes für UE4
// import View from 'ol/view';
// import Map from 'ol/map';
// import TileLayer from 'ol/layer/tile';
// import Stamen from 'ol/source/stamen';
import VectorLayer from 'ol/layer/vector';
//import Vector from 'ol/source/vector';
//import VectorSource from 'ol/source/vector';
//import GeoJSON from 'ol/format/geojson';
import Style from 'ol/style/style';
import IconStyle from 'ol/style/icon';
//import Circle from 'ol/style/circle'; //ueberfluessiges include aus UE3
// import Text from 'ol/style/text';
//import Fill from 'ol/style/fill';
//import Stroke from 'ol/style/stroke';
import proj from 'ol/proj';
import {apply} from 'ol-mapbox-style';
//import AutoComplete from 'javascript-autocomplete'; //additional includes für UE4
import Overlay from 'ol/overlay';
//import coordinate from 'ol/coordinate';


/*ersetzt durch sandbox ausschnitt aus ue4*/
var map = apply(
  'map',
  'style.json'
);


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
var searchResult = new VectorLayer({
  zIndex: 3 //
});

map.addLayer(searchResult);
searchResult.setStyle(new Style({
  image: new IconStyle({
    src: './data/marker1.png'
  })
}));

// const bezirkeLayer = new VectorLayer({
//   source: new Vector({
//     url: 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BEZIRKSGRENZEOGD&srsName=EPSG:4326&outputFormat=json',
//     format: new GeoJSON()
//   }),
//   zIndex: 2
// });
// map.addLayer(bezirkeLayer);
const bezirkeLayer = map.getLayer('bezirksgrenzen');

const ruheLayer = map.getLayer('ruhe');

// const layer = new VectorLayer({
//   source: new Vector({
//     url: 'https://student.ifip.tuwien.ac.at/geoweb/2017/g07/map/postgis_geojson.php',
//     format: new GeoJSON()
//   }),
//   zIndex: 4
// });
// map.addLayer(layer);
//
// layer.setStyle(function(feature) {
//   return new Style({
//     image: new Circle({
//       radius: 7,
//       fill: new Fill({
//         color: 'rgba(232, 12, 12, 1)'
//       }),
//       stroke: new Stroke({
//         color: 'rgba(127, 127, 127, 1)',
//         width: 1
//       })
//     })
//   });
// });

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
var overlay = new Overlay({
  element: document.getElementById('popup-container'),
  positioning: 'bottom-center',
  offset: [0, -10]
});
map.addOverlay(overlay);


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
    layerFilter: (l) => l === ruheLayer
  });
  if (markup) {
    document.getElementById('popup-content').innerHTML = markup;
    overlay.setPosition(e.coordinate);
  } else {
    overlay.setPosition();
    var pos = proj.toLonLat(e.coordinate);
    window.location.href =
      'https://student.ifip.tuwien.ac.at/geoweb/2017/g07/php/insert_point.php?pos=' +
      pos.join(' ');

    // markup += `${markup && '<hr>'}<table><tr><td>`;
    // markup += '<form method="POST" action="insert_point.php">';
    // markup += '         <fieldset>';
    // markup += '  <input type="radio" id="laerm1" name="laerm" value="R">';
    // markup += '  <label for="laerm1">Ruheoase</label>';
    // markup += '  <input type="radio" id="laerm2" name="laerm" value="L">';
    // markup += '  <label for="laerm2">Lärmzone</label>';
    // markup += '</fieldset>';
    // markup += '<fieldset>';
    // markup += '  <input type="radio" id="privacat1" name="privcat" value="1">';
    // markup += '  <label for="privacat1">öffentlich</label>';
    // markup += '    <input type="radio" id="privacat2" name="privcat" value="2">';
    // markup += '    <label for="privacat2">halböffentlich</label>';
    // markup += '  <input type="radio" id="privacat3" name="privcat" value="3">';
    // markup += '  <label for="privacat3">privat</label>';
    // markup += '  </fieldset>';
    //
    // markup += '  <input type="submit" value="send">';
    // markup += '  <input type="reset" value="cancel">';
    // markup += '  <input type="hidden" name="pos" value="<?php echo $_GET[' + pos + '];?> ">';
    // markup += '  </form></td></tr></table>';
    // document.getElementById('popup-content').innerHTML = markup;
    // overlay.setPosition(e.coordinate);
  }
});
