var app = (function() {
    var map = null;
    var mapData = null;
    var roadColors = [
        '#FF0000',
        '#FF3300',
        '#ff6600',
        '#ff9900',
        '#FFCC00',
        '#FFFF00',
        '#ccff00',
        '#99ff00',
        '#66ff00',
        '#33ff00'
    ];
    var incomeColors = [
      '#ededed',
      '#ccc',
      '#999',
      '#666',
      '#444',
      '#222',
      '#000'
    ]
    var incomeData = 'https://andys6190.github.io/roads/syracuse_census_tracts_with_poverty_data.geojson';
    var roadData = 'https://andys6190.github.io/roads/json/MergedRoadRatings';
    var filters = {
        year: 2015,
        property: 'overall'
    };

    function init() {
        map =  new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {lat: 43.079709181516954,  lng:  -76.139201824620429}
        });
        setMapJSON(incomeData);
        setMapJSON(roadData + filters.year + '.json');
    }
    function setMapJSON(source) {
      fetch(source).then(function(ret) {
        return ret.json();
      }).then(function(json) {
        mapData = json;
        map.data.addGeoJson(mapData);
        setDisplayProperty(filters.property);
      });

    }
    function setDisplayProperty(property) {
        map.data.setStyle(function(feature) {
          console.log("income data : " + feature.getProperty('percent_in_poverty'));
            if (feature.getProperty('percent_in_poverty')) {
                var p = feature.getProperty('percent_poverty');
                var i;
                switch (true) {
                  case (p < 0.15):
                    i = 0;
                    break;
                  case (p < 0.3):
                    i = 1;
                    break;
                  case (p < 0.4):
                    i = 1;
                    break;
                  case (p < 0.5):
                    i = 1;
                    break;
                  case (p < 0.6):
                    i = 1;
                    break;
                  case (p < 0.7):
                    i = 1;
                    break;
                  default:
                    i = 6;
                }
                return {
                  fillColor: incomeColors[i],
                  fillOpacity: 0.75,
                  strokeColor: '#555',
                  strokeWeight: 2
                };
            }

            var relevantProperty = feature.getProperty(property);

            if (!relevantProperty) {
                return {
                    strokeWeight: 0
                };
            }

            relevantProperty--;

            return {
                //fillColor: roadColors[relevantProperty],
                strokeColor: roadColors[relevantProperty],
                strokeWeight: 3
            };
        });
    }

    return {
        init: init,
        setDisplayProperty: setDisplayProperty
    };
})();
