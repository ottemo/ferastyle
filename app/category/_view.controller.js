angular.module('categoryModule')

.controller('categoryViewController', [
    '$controller',
    '_',
    '$q',
    '$scope',
    'cartService',
    'pdpProductService',
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

        $scope._addItem = function(product) {
            $scope.submitted = true;
            if ($scope.visitorForm && $scope.visitorForm.$valid) {
                cartService.add(product._id, $scope.qty, pdpProductService.getOptions()).then(
                    function(response) {
                        $scope.isAddingToCart = false;

                        if (response.error !== null) {
                            $scope.message = commonUtilService.getMessage(response);
                        } else {
                            pdpProductService.setOptions({});
                            $scope.isAddToCartSuccess = true;
                            $("#quick-view").modal('hide');
                            $("#quick-view-success").modal('show');
                        }
                    }
                );
            }
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
                    _.forEach(layered, function(filterName){
                        $scope.filters[filterName] = {};
                    });
                    $scope._setFilters();
                    selectSwatches($scope.filters, $scope.layeredSwatches);
                });
        };

        function getLayeredSwatches(layered, mediaConfig, productAttrs) {
            var swatchAttrs = ['colors', 'size', 'length'];
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
            pdpProductService.setProduct(product);
            var productPromise = pdpProductService.getProduct();
            var mediaConfigPromise = mediaService.getMediaConfig();
            $scope.inStock = product.qty !== 0;

            $q.all([productPromise, mediaConfigPromise]).then(function(responses) {
                $scope.popupProduct = responses[0];
                var mediaConfig = responses[1];
                $scope.productService.getRatingInfo(product._id);
                $scope.swatches = getSwatches(product, mediaConfig);
            });


            $("#quick-view").modal('show');
            setTimeout(function() {
                try {
                    $('.rating').rating('update', $scope.productService.getAverageRating());
                } catch (e) {

                }
            }, 300);
        };

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
]);
