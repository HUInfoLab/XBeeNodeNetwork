var valueGet = angular.module('valueGet', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all values and show them
    $http.get('/api/myvalues')
        .success(function(data) {
            $scope.myvalues = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
};