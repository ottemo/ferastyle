angular.module('blogModule', [])

.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/blog', {
                templateUrl: '/views/blog/blogList/list.html',
                controller: 'blogListController'
            })
            .when('/blog/:id', {
                templateUrl: '/views/blog/blogArticle/article.html',
                controller: 'blogArticleController'
            });
}]);
