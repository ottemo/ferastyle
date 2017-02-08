angular.module('commonModule')

// SEO Meta Data
.value('DEFAULT_TITLE', 'Ferastyle')

.run(['$rootScope', '$location', '$anchorScroll', '$timeout',
    function($rootScope, $location, $anchorScroll, $timeout) {
        $rootScope.$on('cfpLoadingBar:completed', function() {
            $timeout(function() {
                if($location.hash()) {
                    $anchorScroll();
                }
            }, 0);
        });
}])

.config([
    '$routeProvider',
    function(
        $routeProvider
    ) {
        $routeProvider
            .when("/search", {
                "templateUrl": "/views/common/search.html",
                "controller": "searchController"
            })
    }
]);
