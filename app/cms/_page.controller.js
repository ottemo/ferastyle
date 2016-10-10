angular.module("cmsModule")
    .controller("cmsPageController", [
        '$anchorScroll',
        '$location',
        '$scope',
        "$controller",
        function(
            $anchorScroll,
            $location,
            $scope,
            $controller
        ) {

            $controller('_cmsPageController', {$scope: $scope});

            $scope.gotoAnchor = function(x) {
                var newHash = 'anchor' + x;
                if ($location.hash() !== newHash) {
                    // set the $location.hash to `newHash` and
                    // $anchorScroll will automatically scroll to it
                    $location.hash('anchor' + x);
                } else {
                    // call $anchorScroll() explicitly,
                    // since $location.hash hasn't changed
                    $anchorScroll();
                }
            };


        }
    ]);




