angular.module('commonModule')
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
