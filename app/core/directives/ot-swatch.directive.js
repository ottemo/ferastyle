angular.module('coreModule')

/**
 * ot-swatch directive renders a swatch
 * attributes:
 * swatch {
 *      label: {String}
 *      swatchImageUrl: {String}
 *      selected: {Boolean}
 *      disabled: {Boolean}
 * }
 */
    .directive('otSwatch', [function () {
        return {
            restrict: 'A',
            scope: {
                swatch: '=otSwatch'
            },
            templateUrl: '/views/core/directives/ot-swatch.html',
            link: function ($scope, $element) {
                $scope.hasImage = Boolean($scope.swatch && $scope.swatch.swatchImageUrl);
                if ($scope.hasImage) {
                    $element.find('img').on('error', function () {
                        $scope.hasImage = false;
                    });
                }
            }
        };
    }]);