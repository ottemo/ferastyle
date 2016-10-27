angular.module("cmsModule")
.config(["$routeProvider", "$locationProvider",
    function (
        $routeProvider, $locationProvider
    ) {
    $routeProvider
        .when("/blog", {
            "templateUrl": "/views/cms/blog/list.html",
            "controller": "listController"
        })
        .when('/blog/:id', {
            "templateUrl": "/views/cms/blog/view.html",
            "controller": "viewController"
        });
}]);
