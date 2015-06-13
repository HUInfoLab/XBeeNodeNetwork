var valueGet = angular.module('valueGet', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all values and show them
    $http.get('/api/myvalues')
        .success(function(data) {
            $scope.myvalues = data;
            
            var z = 0;
            var chartData = new Array()
            while (z < $scope.myvalues.length) {                           
                chartData.push(JSON.stringify($scope.myvalues[z].SensorVal)); //add sensor value to the chartData array                
                z++;
            }         
           
        var x = d3.scale.linear()
            .domain([0, d3.max(chartData)])
            .range([0, 420]);

        d3.select(".chart")
          .selectAll("div")
            .data(chartData)
          .enter().append("div")
            .style("width", function(d) { return x(d) + "px"; })
            .text(function(d) { return d; });
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
};