angular.module("cmsModule")

    .service("blogService", [
        "commonRewriteService",
        function (commonRewriteService) {
            var getUrl, type;

            type = "blog";

            getUrl = function (id) {

                var url;

                url = commonRewriteService.getRewrite(type, id);

                if (!url) {
                    url = type + "/" + id;
                }

                return "/" + url;
            };

            return {
                "getUrl": getUrl
            };
        }
    ]
);
