var app = angular.module('nextGenApp', ['ui.router']);
app.controller('productController', function ($scope, $http) {
    $http.get('../Data/productList.json').then(function (response) {
        $scope.records = response.data;
    });

});
app.controller('profileController', function ($scope, $http) {
    $http.get('../Data/profile.json').then(function (response) {
        $scope.records = response.data;
    });
});
