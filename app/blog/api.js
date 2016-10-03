angular.module('blogModule')

.service('blogApiService', [
    '$resource',
    'REST_SERVER_URI',
    function ($resource, REST_SERVER_URI) {

        return $resource(REST_SERVER_URI, {}, {
            'getBlogList': {
                method: 'GET',
                url: REST_SERVER_URI + '/blog/posts',
                params: {
                    extra: 'title,content',
                    identifier: '~blog'
                }
            },
            'getCount': {
                method: 'GET',
                url: REST_SERVER_URI + '/blog/posts',
                params: {
                    action: 'count'
                }
            },
            'getBlogArticle': {
                method: 'GET',
                url: REST_SERVER_URI + '/blog/:id'
            },
            'getCountPosts': {
                method: 'GET',
                params: {
                    action: 'count'
                },
                url: REST_SERVER_URI + '/cms/pages'
            }
        });
}]);