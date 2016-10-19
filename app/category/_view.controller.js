angular.module('categoryModule')

.controller('categoryViewController', [
    '$controller',
    '$scope',
    'cartService',
    'pdpProductService',
    'commonUtilService',
    'categoryApiService',
    '$rootScope',
    function(
        $controller,
        $scope,
        cartService,
        pdpProductService,
        commonUtilService,
        categoryApiService,
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
