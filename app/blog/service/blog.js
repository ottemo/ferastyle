angular.module('cmsModule')

    .service('blogService', [
        'commonRewriteService',
        function (commonRewriteService) {

            function getUrl(id) {
                var url = commonRewriteService.getRewrite('post', id) || 'post/' + id;
                return '/' + url;
            }

            return {
                getUrl: getUrl
            };
        }
    ]
);
