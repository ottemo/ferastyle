angular.module('categoryModule')

/**
 * ot-clp-swatches displays product image
 * and implements swatches functionality
 *
 * attributes:
 * product      - {Object} product
 * image-size   - {String} size of product images, e.g 'medium'
 */
    .directive('otClpSwatches', ['_', 'pdpApiService', 'imagesService',
        function(_, pdpApiService, imagesService) {

        return {
            restrict: 'EA',
            scope: {
                product: "="
            },
            templateUrl: '/views/category/directives/ot-clp-swatches.html',
            controller: function($scope, $element, $attrs) {
                var size = $attrs.imageSize || 'medium';
                $scope.productService = pdpApiService;

                $scope.imageUrl = ($scope.product.image !== null) ?
                    $scope.product.image[0][size] : imagesService.placeholder;

                imagesService.getMediaParams().then(function(mediaParams) {
                    $scope.swatches = getSwatches(mediaParams);
                });

                $scope.swatchClick = swatchClick;

                ///////////////////////////////////

                function swatchClick(swatch) {
                    $scope.selectedSwatch = swatch.key + '_' + swatch.selection;
                    $scope.imageUrl = swatch.imageUrl;
                }

                function getSwatches(mediaParams) {
                    var swatches = {};
                    _.forEach($scope.product.options, function(option) {
                        if (option.controls_image) {
                            var swatchSet = [];
                            var subOptions = option.options;
                            _.forEach(subOptions, function(selection) {
                                if (selection.image_name) {
                                    swatchSet.push({
                                        imageUrl: imagesService
                                            .getProductImage($scope.product._id, selection.image_name, size, mediaParams),
                                        swatchImageUrl: imagesService
                                            .getSwatchImage(option.key, selection.key, mediaParams),
                                        key: option.key,
                                        selection: selection.key
                                    });
                                }
                            });

                            if (swatchSet.length > 0) {
                                swatches[option.key] = swatchSet;
                            }
                        }
                    });

                    return swatches;
                }
            }
        };
    }]);