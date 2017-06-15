angular.module('pdpModule')

    .controller('pdpViewController', [
        '$controller',
        '$q',
        '$scope',
        '$location',
        'pdpApiService',
        'pdpProductService',
        'categoryApiService',
        'commonRewriteService',
        'mediaService',
        '$rootScope',
        function ($controller, $q, $scope, $location, pdpApiService, pdpProductService, categoryApiService, commonRewriteService, mediaService, $rootScope) {

            // Inherit from default pdpViewController
            $controller('_pdpViewController', { $scope: $scope });

            $scope.activate = function() {
                // REFACTOR: why store options in a service instead of on the
                // product, idk
                // BUG: if we don't clean out the options the pdpProductService tries to hold onto those
                // options on page change
                pdpProductService.setOptions({});
                $scope.ratingInfo = $scope._getDefaultRatingInfo();
                $scope.productScope = $scope;

                $scope._getProduct();
                $scope._getReviews();
                $scope._getRatingInfo();
                $scope.getPdpProductsList();
            };

            $scope.productButtonsAvailable = false;

            $scope.productService = pdpProductService;

            $scope.selectImage = function (newSrc) {
                $scope.activeImg = newSrc;
            };

            $scope._getProduct = function () {
                var productPromise = pdpApiService.getProduct({'productID': $scope.productId}).$promise;
                var mediaConfigPromise = mediaService.getMediaConfig();

                $q.all([productPromise, mediaConfigPromise]).then(function(responses) {
                    var productResponse = responses[0];
                    var mediaConfig = responses[1];

                    if (productResponse.error === null) {
                        var product = productResponse.result || $scope.defaultProduct;

                        pdpProductService.setProduct(product);
                        $scope.product = pdpProductService.getProduct();
                        $scope.inStock = $scope.product.qty === undefined || $scope.product.qty > 0;
                        $scope.$broadcast('product.loaded');

                        // BREADCRUMBS
                        $scope.$emit('add-breadcrumbs', {
                            'label': $scope.product.name,
                            'url': pdpProductService.getUrl($scope.product._id)
                        });

                        if (angular.isArray($scope.product.images) &&  $scope.product.images[0]) {
                            $scope.activeImg = $scope.product.images[0].large;
                        }

                        $scope.swatches = getSwatches(product, mediaConfig);
                        $scope._initWatchers();
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
            };

            function getPdpProductsLinks() {
                var currentPosition = -1;
                if ($scope.productsList.length > 0) {
                    for (var i = 0; i < $scope.productsList.length; i++) {
                        var product = $scope.productsList[i];
                        if (product._id === $scope.productId) {
                            currentPosition = i;
                            break;
                        }
                    }
                    if (currentPosition < $scope.productsList.length - 1) {
                        $scope.nextPositionId = $scope.productsList[currentPosition + 1]['_id'];
                    }
                    if (currentPosition === $scope.productsList.length - 1) {
                        $scope.nextPositionId = $scope.productsList[0]['_id'];
                    }
                    if (currentPosition > 0) {
                        $scope.previousPositionId = $scope.productsList[currentPosition - 1]['_id'];
                    }
                    if (currentPosition === 0) {
                        $scope.previousPositionId = $scope.productsList[$scope.productsList.length - 1]['_id'];
                    }
                    $scope.productButtonsAvailable = true;
                }
            }

            /**
             * Builds product swatches from options
             * result example {
             *      colors: {
             *          black: {
             *              swatchImageUrl: 'demo.ottemo.io/media/swatch/colors_black.png',
             *              imageUrl: 'demo.ottemo.io/media/image/Product/123/black.jpg',
             *              label: 'Black",
             *              selected: false,
             *              _ids: [1, 2, 7, 10]
             *          },
             *          red: {
             *            ...
             *          }
             *      },
             *      sizes: {
             *          ...
             *      }
             * }
             */
            function getSwatches(product, mediaParams) {
                var swatches = {};
                var size = 'medium';
                _.forEach(product.options, function(option) {
                    if (option.type === 'select_image' || option.type === 'select_text') {
                        var swatchSet = {};
                        var subOptions = option.options;
                        _.forEach(subOptions, function(selection) {
                            var swatch = {};
                            swatch.label = selection.label;
                            swatch.selected = false;
                            if (option.type === 'select_image') {
                                swatch.swatchImageUrl = mediaService
                                    .getSwatchImage(option.key, selection.key, mediaParams);
                            }
                            if (option.controls_image === true && selection.image_name) {
                                swatch.imageUrl = mediaService
                                    .getProductImage(product._id, selection.image_name, size, mediaParams);
                            }
                            if (option.has_associated_products === true) {
                                swatch._ids = selection._ids;
                            }

                            swatchSet[selection.key] = swatch;
                        });

                        if (!_.isEmpty(swatchSet)) {
                            swatches[option.key] = swatchSet;
                        }
                    }
                });

                if (!_.isEmpty(swatches)) {
                    removeSoldOutProductIds(product, swatches);
                }
                return swatches;
            }

            /**
             *  Removes sold out product ids from the swatches
             */
            function removeSoldOutProductIds(product, swatches) {
                var inventory = product.inventory;
                _.forEach(inventory, function(inventoryItem) {
                    var inventoryOptions = inventoryItem.options;
                    if (_.isEmpty(inventoryOptions) || inventoryItem.qty !== 0) return;

                    var _ids = [];
                    _.forEach(inventoryOptions, function(optionValue, optionKey) {
                        var productOption = _.find(product.options, { key: optionKey.toString() });

                        if (productOption && productOption.options) {
                            var selection = _.find(productOption.options, { key: optionValue.toString() });

                            if (selection && selection._ids && selection._ids.length > 0) {
                                _ids.push(selection._ids);
                            }
                        }
                    });

                    var soldOutIds = _.intersection.apply(this, _ids);
                    if (soldOutIds.length > 0) {
                        _.forEach(inventoryOptions, function(optionValue, optionKey) {
                            if (swatches[optionKey] && swatches[optionKey][optionValue]) {
                                var swatch = swatches[optionKey][optionValue];
                                swatch._ids = _.difference(swatch._ids, soldOutIds);
                            }
                        })
                    }
                });
            }
        }
    ]
);
