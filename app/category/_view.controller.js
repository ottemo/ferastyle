angular.module('categoryModule')

.controller('categoryViewController', [
    '$controller',
    '$scope',
    'cartService',
    'pdpProductService',
    'commonUtilService',
    function(
        $controller,
        $scope,
        cartService,
        pdpProductService,
        commonUtilService
    ) {

        $controller('_categoryViewController', { $scope: $scope });

        $scope.message = {};
        $scope.isAddingToCart = false;
        $scope.isAddToCartSuccess = false;
        $scope.customOptionsForm;
        $scope.qty = 1;

        $scope._addItem = function(product) {
            $scope.submitted = true
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
    }
]);
