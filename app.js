var app = (function() {
    var map = null;
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
      '#ddd',
      '#ffcc00',
      '#ff9900',
      '#ff6600',
      '#ff2900',
      '#d6301d',
      '#b81609'
    ]
    var incomeData = 'https://andys6190.github.io/roads/json/syracuse_census_tracts_with_poverty_data.geojson';
    var roadData = 'https://andys6190.github.io/roads/json/MergedRoadRatings';
    var filters = {
        year: 2015,
        quality: [1, 2, 3, 4, 5],
        roadType: 'all'
    };

    function init() {
        map =  new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {lat: 43.079709181516954,  lng:  -76.139201824620429}
        });
        setMapJSON(incomeData);
        setMapJSON(roadData + filters.year + '.json');
        bind();
    }

    function bind() {
        $('.yearselect').click(function(e){
            console.log(e);
            alert(this.getElementsByTagName("a")[0].innerHTML);
        });
        $('.crackselect').click(function(){
            alert(this.getElementsByTagName("a")[0].innerHTML);
        });
        $('.qualityselect').click(function(){
            alert(this.getElementsByTagName("a")[0].innerHTML);
        });
        $('.classselect').click(function(){
            alert(this.getElementsByTagName("a")[0].innerHTML);
        });
    }

    function setMapJSON(source) {
      fetch(source).then(function(ret) {
        return ret.json();
      }).then(function(json) {
        map.data.addGeoJson(json);
        setInitialDisplay()
      });

    }

    function updateFilters() {
        map.data.setStyle(function(feature) {
            if (feature.getProperty('percent_in_poverty')) {
                return;
            }

            var overall = feature.getProperty('overall');

            if (!overall) {
                return {
                    strokeWeight: 0
                };
            }

            overall = Math.floor(relevantProperty / 2);

            if (filters.quality.indexOf(overall) === -1) {
                return {
                    strokeWeight: 0
                };
            }

            return;
        });
    }

    function setInitialDisplay() {
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
                    i = 2;
                    break;
                  case (p < 0.5):
                    i = 3;
                    break;
                  case (p < 0.6):
                    i = 4;
                    break;
                  case (p < 0.7):
                    i = 5;
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

            var relevantProperty = feature.getProperty('overall');

            if (!relevantProperty) {
                return {
                    strokeWeight: 0
                };
            }

            relevantProperty--;

            return {
                strokeColor: roadColors[relevantProperty],
                strokeWeight: 3
            };
        });
    }

    return {
        init: init
    };
})();
