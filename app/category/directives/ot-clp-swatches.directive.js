angular.module('categoryModule')

/**
 * ot-clp-swatches displays product image
 * and implements swatches functionality
 *
 * attributes:
 * product      - {Object} product
 * image-size   - {String} size of product images, e.g 'medium'
 */
    .directive('otClpSwatches', ['_', 'pdpProductService', 'mediaService',
        function(_, pdpProductService, mediaService) {

        return {
            restrict: 'EA',
            scope: {
                product: "="
            },
            templateUrl: '/views/category/directives/ot-clp-swatches.html',
            controller: function($scope, $element, $attrs) {
                var size = $attrs.imageSize || 'medium';
                $scope.productService = pdpProductService;

                $scope.imageUrl = ($scope.product.image !== null) ?
                    $scope.product.image[0][size] : mediaService.placeholder;

                mediaService.getMediaConfig().then(function(mediaParams) {
                    $scope.swatches = getSwatches(mediaParams);
                });

                $scope.swatchClick = swatchClick;

                ///////////////////////////////////

                function swatchClick(swatch) {
                    _.forEach($scope.swatches, function(swatchSet) {
                        _.forEach(swatchSet, function(swatch) {
                            swatch.selected = false;
                        });
                    });
                    swatch.selected = true;
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
                                        imageUrl: mediaService
                                            .getProductImage($scope.product._id, selection.image_name, size, mediaParams),
                                        swatchImageUrl: mediaService
                                            .getSwatchImage(option.key, selection.key, mediaParams),
                                        label: selection.label,
                                        selected: false
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