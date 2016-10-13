angular.module('pdpModule')

    .controller('pdpViewController', [
        '$controller',
        '$scope',
        '$location',
        'pdpApiService',
        'pdpProductService',
        function ($controller, $scope, $location, pdpApiService, pdpProductService) {

            // Inherit from default pdpViewController
            $controller('_pdpViewController', { $scope: $scope });

            $scope.selectImage = function (newSrc) {
                $scope.activeImg = newSrc;git 
            };

            $scope._getProduct = function () {
                pdpApiService.getProduct({'productID': $scope.productId}).$promise.then(function (response) {
                    if (response.error === null) {
                        var result = response.result || $scope.defaultProduct;

                        pdpProductService.setProduct(result);
                        $scope.product = pdpProductService.getProduct();
                        $scope.$broadcast('product.loaded');

                        // BREADCRUMBS
                        $scope.$emit('add-breadcrumbs', {
                            'label': $scope.product.name,
                            'url': pdpProductService.getUrl($scope.product._id)
                        });

                        if (angular.isArray($scope.product.images) &&  $scope.product.images[0]) {
                            $scope.activeImg = $scope.product.images[0].large;
                        }
                    } else {
                        $location.path('/');
                    }
                });
            };
        }
    ]
);
