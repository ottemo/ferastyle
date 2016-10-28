angular.module("cmsModule")
.config(["$routeProvider", "$locationProvider",
    function (
        $routeProvider, $locationProvider
    ) {
    $routeProvider
        .when("/blog", {
            "templateUrl": "/views/blog/list.html",
            "controller": "listController"
        })
        .when('/post/:id', {
            "templateUrl": "/views/blog/view.html",
            "controller": "viewController"
        });
}]);
