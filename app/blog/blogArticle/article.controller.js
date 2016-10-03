angular.module('blogModule')

.controller('blogArticleController', [
    '$scope',
    'blogApiService',
    '$routeParams',
    function(
        $scope,
        blogApiService,
        $routeParams
    ) {

        $scope.getUrl = function(URL){
            return 'blog/' + URL;
        };

        $scope.activate = function(){
            blogApiService.getBlogArticle().$promise
                .then(function(response){
                    var articles = response.result || {};

                    $scope.article = articles.article || {};
                    $scope.previous = articles.previous || "";
                    $scope.next = articles.next || "";

                    $scope.$emit('add-breadcrumbs', {
                        'label': $scope.article.title,
                        'url': $scope.article.URL
                    });
                })

        }
}])