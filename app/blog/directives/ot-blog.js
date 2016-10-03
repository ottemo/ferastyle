angular.module('blogModule')

.directive('otBlog', function() {
    return {
        restrict: 'E',
        scope: {
            'article': '='
        },
        templateUrl: '/views/blog/directives/ot-blog.html',
        controller: function($scope) {

        }
    }
})