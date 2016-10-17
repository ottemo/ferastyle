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

                $scope.showChart = function () {
                    $("#modal_adult_chart").modal('show');
                }
            }
        };
    }]);

