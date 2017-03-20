angular.module('categoryModule')

.controller('categoryViewController', [
    '$controller',
    '_',
    '$q',
    '$scope',
    'cartService',
    'pdpProductService',
    'pdpProductOptionsService',
    'commonUtilService',
    'categoryApiService',
    'pdpApiService',
    'mediaService',
    '$rootScope',
    function(
        $controller,
        _,
        $q,
        $scope,
        cartService,
        pdpProductService,
        pdpProductOptionsService,
        commonUtilService,
        categoryApiService,
        pdpApiService,
        mediaService,
        $rootScope
    ) {

        $controller('_categoryViewController', { $scope: $scope });

        $scope.message = {};
        $scope.isAddingToCart = false;
        $scope.isAddToCartSuccess = false;
        $scope.customOptionsForm;
        $scope.qty = 1;

        $scope._getProducts = function() {
            var params = $scope._getParams();
            params["categoryID"] = $scope.categoryId;
            categoryApiService.getProductsByCategoryId(params).$promise.then(function(response) {
                var result = response.result || [];
                $scope.productsList = result;
                // Save against the rootscope so that we can continue to shop the category
                // from the PDP
                $rootScope.productsListUpperLevel = result;
            });
        };

        /**
         * Gets layers for category
         */
        $scope._getLayered = function() {
            var layeredPromise = categoryApiService.getLayered({ categoryID: $scope.categoryId }).$promise;
            var mediaConfigPromise = mediaService.getMediaConfig();
            var attributesPromise = pdpApiService.getAttributes().$promise;

            $q.all([layeredPromise, mediaConfigPromise, attributesPromise])
                .then(function(responses) {
                    var layered = responses[0].result || [];
                    var mediaConfig = responses[1];
                    var productAttrs =  responses[2].result || [];

                    $scope.layeredSwatches = getLayeredSwatches(layered, mediaConfig, productAttrs);
                    $scope.layered = layered;
                    $scope.filterLabels = {};
                    _.forEach(layered, function(filterValue, filterKey){
                        $scope.filters[filterKey] = {};
                        $scope.filterLabels[filterKey] = _.find(productAttrs, { 'Attribute': filterKey }).Label;
                    });

                    $scope._setFilters();
                    selectSwatches($scope.filters, $scope.layeredSwatches);
                });
        };

        function getLayeredSwatches(layered, mediaConfig, productAttrs) {
            var swatchAttrs = ['colors', 'size', 'size_length'];
            var swatches = {};

            _.forEach(layered, function(values, attrKey) {
                if (swatchAttrs.indexOf(attrKey) !== -1) {
                    swatches[attrKey] = {};
                    var productAttr = _.filter(productAttrs, { Attribute: attrKey })[0];
                    var attrOptions = parseAttrOptions(productAttr.Options);

                    _.forEach(values, function(attrValue) {
                        swatches[attrKey][attrValue] = {
                            label: (attrOptions[attrValue] !== undefined) ?
                                attrOptions[attrValue] : attrValue,
                            swatchImageUrl: (attrKey === 'colors') ?
                                mediaService.getSwatchImage(attrKey, attrValue, mediaConfig) : null
                        }
                    });
                }
            });

            return swatches;
        }

        function parseAttrOptions(optionsStr) {
            var options = {};

            try {
                // JSON
                options = JSON.parse(optionsStr.replace('\'', '"'));
            } catch(e) {
                // String '{red,blue}' -> Object {red: red, blue: blue}
                var optionItems = optionsStr.replace(/[{}]/g, '').split(',');
                _.forEach(optionItems, function(optionItem) {
                    options[optionItem] = optionItem;
                });
            }

            return options;
        }

        function selectSwatches(filters, swatches) {
            _.forEach(swatches, function(swatchSet, attrKey) {
                if (attrKey in filters) {
                    for (var attrValue in filters[attrKey]) {
                        swatches[attrKey][attrValue].selected = true;
                    }
                }
            })
        }

        $scope.filterSwatchClick = function(filterKey, filterValue) {
            var filter = $scope.filters[filterKey];
            if (filter !== undefined) {
                filter[filterValue] = !filter[filterValue];
            } else {
                $scope.filters[filterKey] = {};
                $scope.filters[filterKey][filterValue] = true;
            }
        };

        /**
         * Opens quick view modal window
         */
        $scope.openPopUp = function(product) {
            $scope.message = {};
            $scope.options = {};
            $scope.submitted = false;
            pdpProductService.setProduct(product);
            pdpProductService.setOptions($scope.options);
            var productPromise = pdpProductService.getProduct();
            var mediaConfigPromise = mediaService.getMediaConfig();
            $scope.inStock = product.qty == undefined || product.qty > 0;

            $q.all([productPromise, mediaConfigPromise]).then(function(responses) {
                $scope.popupProduct = responses[0];
                var mediaConfig = responses[1];
                $scope.productService.getRatingInfo(product._id);
                $scope.swatches = pdpProductOptionsService.getSwatches(product, mediaConfig);
                $scope.activeImg = $scope.popupProduct.image[0].medium;

                $("#quick-view").modal('show');
                setTimeout(function() {
                    try {
                        $('.rating').rating('update', $scope.productService.getAverageRating());
                    } catch (e) {

                    }
                }, 300);
            });
        };
    }
]);
