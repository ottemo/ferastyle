angular.module("commonModule")

.controller("HomeController", [
    "$controller",
    "$scope",
    "instagramService",
    function(
        $controller,
        $scope,
        instagramService
    ) {
        $controller('_HomeController', {$scope: $scope});

        $scope.instagramPics = [];

        instagramService.fetchPhotos().then(function(data) {
            $scope.instagramPics = data;
            $scope.$broadcast('instagramPics.loaded');
        });
    }
]);
