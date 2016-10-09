var app = (function() {
    var map = null;
    var incomeData = null;
    var roadData = null;
    var roadColors = [
        '#FF0000',
        '#FF0000',
        '#ff9900',
        '#ff9900',
        '#FFFF00',
        '#FFFF00',
        '#ccff00',
        '#ccff00',
        '#33ff00',
        '#33ff00'
    ];
    var incomeColors = [
      '#E1F7FA',
      '#BCF1F7',
      '#99E9F2',
      '#74D8E3',
      '#3CA0AB',
      '#126770',
      '#013036'
    ]
    var incomeDataUrl = 'https://andys6190.github.io/roads/json/syracuse_census_tracts_with_poverty_data.geojson';
    var roadDataUrl = 'https://andys6190.github.io/roads/json/MergedRoadRatings';
    var selectedYear = 2015;
    var initialFilters = {
        quality: [1, 2, 3, 4, 5],
        roadType: 'all'
    };
    var filters = $.extend({}, initialFilters);

    function init() {
        map =  new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            minZoom: 12,
            center: {lat: 43.0481,  lng:  -76.1474}
        });
        getMapJSON(incomeDataUrl).then(function(json) {
            incomeData = new google.maps.Data();
            incomeData.addGeoJson(json);
            setIncomeDisplay();
        });
        getMapJSON(roadDataUrl + selectedYear + '.json').then(function(json) {
            roadData = new google.maps.Data();
            roadData.addGeoJson(json);
            setRoadDisplay();
        });
        bind();
    }

    function bind() {
        $('.yearselect').click(function(e){
            selectedYear = e.target.innerHTML;
            roadData.setMap(null);
            filters = $.extend({}, initialFilters);
            getMapJSON(roadDataUrl + selectedYear + '.json').then(function(json) {
                roadData = new google.maps.Data();
                roadData.addGeoJson(json);
                setRoadDisplay();
            });
        });
        $(document).on('classUpdated', function(e, roadType){
            filters.roadType = roadType;
            updateFilters();
        });
        $(document).on('qualityUpdated', function(e, quality){
            filters.quality = quality;
            updateFilters();
        });
    }

    function getMapJSON(source) {
        return new Promise(function(resolve, reject) {
            fetch(source).then(function(ret) {
                return ret.json();
            }).then(function(json) {
                resolve(json);
                resolve();
            });
      });
    }

    function updateFilters() {
        roadData.setStyle(function(feature) {
            if (feature.getProperty('percent_in_poverty')) {
                return;
            }

            var overall = feature.getProperty('overall');

            if (!overall) {
                return {
                    strokeWeight: 0
                };
            }

            if (filters.quality.indexOf(overall) === -1) {
                return {
                    strokeWeight: 0
                };
            }

            var roadType = feature.getProperty('class');

            if (filters.roadType !== 'all' && filters.roadType !== roadType) {
                return {
                    strokeWeight: 0
                };
            }

            overall--;

            return {
                fillColor: roadColors[overall],
                strokeColor: roadColors[overall],
                strokeWeight: 2
            };
        });
    }

    function setRoadDisplay() {
        roadData.setStyle(function(feature) {
            if (feature.getProperty('percent_in_poverty')) {
                return;
            }

            var overall = feature.getProperty('overall');

            if (!overall) {
                return {
                    strokeWeight: 0
                };
            }

            overall--;

            return {
                fillColor: roadColors[overall],
                strokeColor: roadColors[overall],
                strokeWeight: 2
            };
        });

        roadData.setMap(map);
    }

    function setIncomeDisplay() {
        incomeData.setStyle(function(feature) {
            if (!feature.getProperty('percent_in_poverty')) {
                return;
            }

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
              strokeWeight: 1
            };
        });

        incomeData.setMap(map);
    }

    return {
        init: init
    };
})();
