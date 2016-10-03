angular.module('blogModule')

.controller('blogListController', [
    '$scope',
    'blogApiService',
    '$location',
    function(
        $scope,
        blogApiService,
        $location
    ) {

        $scope.itemsPerPage = 10;

        $scope.$emit('add-breadcrumbs', {
            'label': 'Blog',
            'url': '/blog'
        });


        $scope.activate = function(){
            var params = _getPaginatorParams();

            blogApiService.getBlogList(params).$promise
                .then(function(response) {
                    $scope.blogList = response.result || [];
                })

            blogApiService.getCount().$promise
                .then(function(response) {
                    $scope.totalItems = response.result || 100;
                    $scope.pages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
                })
        }

        function _getPaginatorParams() {
            var search = $location.search(),
                result = {};

            $scope.currentPage = (search.p !== undefined) ? (search.p - 1) : 0;

            for (var key in search) {
                if (search.hasOwnProperty(key)) {
                    result[key] = search[key];
                }
            }

            result.limit = ($scope.currentPage === 0) ? 0 : $scope.currentPage * $scope.itemsPerPage;
            result.limit += ',' + $scope.itemsPerPage;

            return result;
        }
}])