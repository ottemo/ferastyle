angular.module('cmsModule')
.controller('listController', [
    '$scope',
    'blogApiService',
    'blogService',
    '$location',
    function(
        $scope,
        blogApiService,
        blogService,
        $location
    ) {

        $scope.blogs = {};
        var getBlogUrl;

        $scope.activate = function() {
            $scope._getblogs();
        };

        $scope._getblogs = function() {

            blogApiService.getBlogs({
            }).$promise.then(function(response) {
                    $scope.blogs = response.result || {};

                    var i, blogLength = $scope.blogs.length;
                    for(i =0; i < blogLength; i++){
                        $scope.blogs[i].url = getBlogUrl($scope.blogs[i]._id);
                        $scope.blogs[i].seoUrl = $location.host()+$scope.blogs[i].url;
                    }

                    // BREADCRUMBS
                    $scope.$emit("add-breadcrumbs", {
                        "label": "Blog",
                        "url": "/blog"
                    });
            });

            getBlogUrl = blogService.getUrl;

        };
    }
]);
