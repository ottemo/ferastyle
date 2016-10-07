angular.module('commonModule')
.controller('searchController', [
    '$scope',
    '$location',
    'searchApiService',
    'pdpProductService',
    function(
        $scope,
        $location,
        searchApiService,
        pdpProductService
    ) {

        $scope.getUrl = pdpProductService.getUrl;
        $scope.searchText = $location.search().q;

        $scope.activate = function() {

            searchApiService.getSearchProduct({
                "name": "~" + $scope.searchText
            }).$promise.then(function(response) {
                    $scope.products = response.result || [];
                });

        };



}]);
