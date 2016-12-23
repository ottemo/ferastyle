angular.module("commonModule")

    .service("instagramService", [
        "$http",
        "$q",
        function ($http, $q) {
            var user_id = '248686262';
            var access_token = '248686262.1677ed0.cd0efb5821704d3782fb1032cff6e1e2';
            var defer = $q.defer();

            activate();

            function activate() {
                var endpoint = 'https://api.instagram.com/v1/users/';
                endpoint += user_id;
                endpoint += '/media/recent/?';
                endpoint += '?count=99';
                endpoint += '&callback=JSON_CALLBACK';
                endpoint += '&access_token=' + access_token;
                $http.jsonp(endpoint)
                    .success(function(response) {
                        defer.resolve(response.data);
                    })
                    .error(function(response) {
                        defer.reject(response.data);
                    })
            }

            var fetchPhotos = function (callback) {
                return defer.promise;
            }

            return {
                "fetchPhotos": fetchPhotos
            };
        }
    ]
    );