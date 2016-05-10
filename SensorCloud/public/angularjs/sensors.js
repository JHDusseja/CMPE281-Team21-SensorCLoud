/**
 * Created by Jayesh on 4/28/2016.
 */

var app = angular.module('myApp', []);
app.controller('sensorsCtrl', function($scope, $http) {
    $http({
        method : "GET",
        url : '/providesensorslist',
        data : {}
    }).success(function(data) {
        //checking the response data for statusCode
        $scope.stationslist = data;
    }).error(function(error) {});
});

