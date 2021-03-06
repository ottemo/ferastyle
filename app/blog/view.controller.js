angular.module('commonModule')
.controller('viewController', [
    '$scope',
    '$routeParams',
    'blogApiService',
    'blogService',
    function(
        $scope,
        $routeParams,
        blogApiService,
        blogService
    ) {

        $scope.blogID = $routeParams.id;
        $scope.url = blogService.getUrl($scope.blogID);

        $scope.blog = {};

        $scope.activate = function() {
            $scope._getBlog();
        };

        $scope._getBlog = function() {

            blogApiService.getBlog({'blogID': $scope.blogID
            }).$promise.then(function(response) {
                    $scope.blog = response.result || {};

                    if($scope.blog.extra.prev) {
                        $scope.blog.prev = blogService.getUrl($scope.blog.extra.prev._id);
                    } else
                    {
                        $scope.blog.prev = undefined;
                    }

                    if($scope.blog.extra.next) {
                        $scope.blog.next = blogService.getUrl($scope.blog.extra.next._id);
                    } else
                    {
                        $scope.blog.next = undefined;
                    }

                    // BREADCRUMBS
                    $scope.$emit('add-breadcrumbs', {
                        label: 'Blog',
                        url: '/blog'
                    });
                    $scope.$emit('add-breadcrumbs', {
                        label: $scope.blog.identifier,
                        url: $scope.url
                    });
                });
        };
    }
]);
