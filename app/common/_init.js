angular.module('commonModule')

// SEO Meta Data
.value('DEFAULT_TITLE', 'Ferastyle')

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
