angular.module('commonModule')

.service('blogApiService', [
    '$resource',
    'REST_SERVER_URI',
    function ($resource, REST_SERVER_URI) {
        return $resource(REST_SERVER_URI, {}, {
            'getBlogs': {
                method: 'GET',
                url: REST_SERVER_URI + '/blog/posts',
            },
            'getBlog': {
                method: 'GET',
                url: REST_SERVER_URI + '/blog/post/:blogID',
            }
        });
    }]);
