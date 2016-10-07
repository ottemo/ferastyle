angular.module('commonModule')

.service('searchApiService', [
    '$resource',
    'REST_SERVER_URI',
    function ($resource, REST_SERVER_URI) {
        return $resource(REST_SERVER_URI, {}, {
            'getSearchProduct': {
                method: 'GET',
                url: REST_SERVER_URI + '/products/:params',
                params: {
                    extra: 'name,price'
                }
            }
        });
    }]);
