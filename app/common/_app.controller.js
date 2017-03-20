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
            $location.search('q', searchText);
            $location.path('/search');
        };

        $scope.$on('$viewContentLoaded', function(){
            if($('.navbar-main .dropdown-nav').hasClass('open')){
                $('.navbar-main .dropdown-nav').removeClass('open');
            }
        });

    }
]);


