angular.module('pdpModule')

    .directive('otCustomOptions', [function() {
        return {
            restrict: 'E',
            scope: {
                'parent': '=object',
                'product': '=item'
            },
            templateUrl: '/views/pdp/ot-custom-options.html',
            controller: function($scope) {

                $scope.selectFirstOption = selectFirstOption;
                $scope.selectFirstRadio = selectFirstRadio;
                $scope.toggleCheckbox = toggleCheckbox;
                $scope.todaysDate = new Date();

                $scope.$watch('customOptionsForm', function() {
                    $scope.parent.customOptionsForm = $scope.customOptionsForm;
                }, true);

                ///////////////////////////

                // select first option for radio
                function selectFirstRadio(option) {
                    if (option.type === 'radio' && option.options[0]) {
                        $scope.parent.options[option.key] = option.options[0].key;
                    }
                }

                function selectFirstOption(option) {
                    if (option.options.length) {
                        $scope.parent.options[option.key] = option.options[0].key;
                    }
                }

                /**
                 * checkbox options want to be in the format
                 * {"gift_card":["gift_card"]}
                 */
                function toggleCheckbox(option) {

                    // See if we have any selected option Items
                    var selectedCheckboxes = [];
                    angular.forEach(option.options, function(optionItem) {
                        if (optionItem.selected) {
                            selectedCheckboxes.push(optionItem.key);
                        }
                    });

                    // If we have any selected boxes save them out
                    if (selectedCheckboxes.length) {
                        $scope.parent.options[option.key] = selectedCheckboxes;
                    } else {
                        // Otherwise remove the whole option
                        delete $scope.parent.options[option.key];
                    }
                }

                $scope.getOptionValueLabel = function(option, value) {
                    if (value === undefined) return '';

                    var selection = _.filter(option.options, { key: value });
                    return (selection.length > 0) ? selection[0].label : '';
                };

                $scope.swatchClick = function(optionKey, selectionKey) {
                    var swatch = $scope.parent.swatches[optionKey][selectionKey];

                    _.forEach($scope.parent.swatches[optionKey], function(swatch) {
                        swatch.selected = false;
                    });
                    swatch.selected = true;

                    if (swatch._ids) {
                        setOptionsAvailability($scope.parent.swatches);
                    }

                    if (swatch.imageUrl) {
                        $scope.parent.activeImg = swatch.imageUrl;
                    }
                    $scope.parent.options[optionKey] = selectionKey;

                    if ($scope.parent.qty !== undefined && $scope.parent.qty !== 0) {
                        var isInStock = true;
                        _.forEach($scope.parent.swatches, function(swatchSet) {
                            _.forEach(swatchSet, function(swatch) {
                                if (swatch.selected && swatch.disabled) {
                                    isInStock = false;
                                }
                            });
                        });
                        $scope.parent.inStock = isInStock;
                    }
                };

                function setOptionsAvailability(swatches) {
                    resetAvailability(swatches);

                    _.forEach(swatches, function(swatchSet, swatchSetKey) {
                        var selectedSwatch = _.filter(swatchSet, { 'selected': true })[0];
                        if (!selectedSwatch) return;

                        var selectedIds = selectedSwatch._ids;
                        if (!selectedIds) return;

                        disableSwatches(swatches, selectedIds, swatchSetKey);
                    });

                    function resetAvailability(swatches) {
                        _.forEach(swatches, function(swatchSet) {
                            _.forEach(swatchSet, function(swatch) {
                                swatch.disabled = false;
                            });
                        });
                    }

                    function disableSwatches(swatches, _ids, skipSwatchSet) {
                        _.forEach(swatches, function(swatchSet, swatchSetKey) {
                            if (swatchSetKey === skipSwatchSet) return;

                            _.forEach(swatchSet, function(swatch) {
                                if (swatch._ids === undefined || swatch.disabled === true) return;

                                var intersect = _.intersection(_ids, swatch._ids);
                                if (intersect.length === 0) {
                                    swatch.disabled = true;
                                }
                            })
                        })
                    }
                }

                $scope.showChart = function () {
                    $("#modal_adult_chart").modal('show');
                };

                /**
                 * FeraStyle specific
                 * Hack to fix product option labels on frontend
                 */
                $scope.getOptionLabel = function(option) {
                    switch (option.key) {
                        case 'colors':
                            return 'Colors';
                        case 'size':
                            return 'Sizes';
                        case 'size_length':
                            return 'Length';
                        default:
                            return option.label;
                    }
                }
            }
        };
    }]);

