angular.module('pdpModule')

    .controller('pdpViewController', [
        '$controller',
        '$scope',
        '$location',
        'pdpApiService',
        'pdpProductService',
        "categoryApiService",
        "commonRewriteService",
        "$rootScope",
        function ($controller, $scope, $location, pdpApiService, pdpProductService, categoryApiService, commonRewriteService, $rootScope) {

            // Inherit from default pdpViewController
            $controller('_pdpViewController', { $scope: $scope });

            $scope.activate = function() {
                // REFACTOR: why store options in a service instead of on the
                // product, idk
                // BUG: if we don't clean out the options the pdpProductService tries to hold onto those
                // options on page change
                pdpProductService.setOptions({});
                $scope.ratingInfo = $scope._getDefaultRatingInfo();

                $scope._getProduct();
                $scope._getReviews();
                $scope._getRatingInfo();
                $scope._initWatchers();
                $scope.getPdpProductsList();
            };

            $scope.productButtonsAvailable = false;

            $scope.productService = pdpProductService;

            $scope.selectImage = function (newSrc) {
                $scope.activeImg = newSrc;
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

            $scope.getPdpProductsList = function (){
                if ($rootScope.productsListUpperLevel) {
                    $scope.productsList = $rootScope.productsListUpperLevel;
                    getPdpProductsLinks();
                }
                else {
                    var categotyName = $location.absUrl().split('/')[3];
                    var parentCategoryId = commonRewriteService.getCategoryIdByUrl(categotyName);
                    if(parentCategoryId !== null) {
                        categoryApiService.getProductsByCategoryId({categoryID: parentCategoryId}).$promise
                            .then(function (response) {
                                if(response.result !== null) {
                                    $rootScope.productsListUpperLevel = response.result || [];
                                    $scope.productsList = $rootScope.productsListUpperLevel;
                                    getPdpProductsLinks();
                                }
                            });
                    }
                }
            };

            function getPdpProductsLinks() {
                var currentPosition = -1;
                if ($scope.productsList.length > 0) {
                    for (var i=0; i < $scope.productsList.length; i++) {
                        var product = $scope.productsList[i];
                        if (product._id === $scope.productId) {
                            currentPosition = i;
                            break;
                        }
                    }
                    if (currentPosition < $scope.productsList.length - 1) {
                        $scope.nextPositionId = $scope.productsList[currentPosition + 1]["_id"];
                        $scope.nextPositionImg = $scope.productsList[currentPosition + 1]["image"]["thumb"];
                    }
                    if (currentPosition === $scope.productsList.length - 1) {
                        $scope.nextPositionId = $scope.productsList[0]["_id"];
                        $scope.nextPositionImg = $scope.productsList[0]["image"]["thumb"];
                    }
                    if (currentPosition > 0) {
                        $scope.previousPositionId = $scope.productsList[currentPosition - 1]["_id"];
                        $scope.previousPositionImg = $scope.productsList[currentPosition - 1]["image"]["thumb"];
                    }
                    if (currentPosition === 0) {
                        $scope.previousPositionId = $scope.productsList[$scope.productsList.length - 1]["_id"];
                        $scope.previousPositionImg = $scope.productsList[$scope.productsList.length - 1]["image"]["thumb"];
                    }
                    $scope.productButtonsAvailable = true;
                }
            }

        }
    ]
);
