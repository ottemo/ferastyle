angular.module("commonModule")

.controller("appController", [
    "$scope",
    "$controller",
    "$location",

    function(
        $scope,
        $controller,
        $location
    ) {

        $controller('_appController', {$scope: $scope});

        $scope.searchProducts = function(searchText) {
            console.log(22);
            $location.search('q', searchText);
            $location.path('/search');
        };

    }
]);


