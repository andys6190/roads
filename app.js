var app = (function() {
    var map = null;
    var mapData = null;
    var colors = [
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
    var filters = {
        year: 2015,
        property: 'overall'
    };

    function init() {
        map =  new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: {lat: 43.079709181516954,  lng:  -76.139201824620429}
        });

        fetch('https://andys6190.github.io/roads/json/MergedRoadRatings2015.json').then(function(ret) {
            return ret.json();
        }).then(function(json) {
            mapData = json;
            map.data.addGeoJson(mapData);
            setDisplayProperty('overall');
        });
    }

    function setDisplayProperty(property) {
        map.data.setStyle(function(feature) {
            if (feature.getProperty('percent_in_poverty')) {
                return;
            }

            var relevantProperty = feature.getProperty(property);

            if (!relevantProperty) {
                return {
                    strokeWeight: 0
                };
            }

            relevantProperty--;

            return {
                fillColor: colors[relevantProperty],
                strokeColor: colors[relevantProperty],
                strokeWeight: 4
            };
        });
    }

    return {
        init: init,
        setDisplayProperty: setDisplayProperty
    };
})();
