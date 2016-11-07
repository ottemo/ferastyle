angular.module('commonModule')

    .service('imagesService', ['_', '$q', 'imagesApiService', function(_, $q, imagesApiService) {
        var SWATCH_EXT = '.png';
        var PLACEHOLDER = '/images/placeholder.png';

        var mediaParamsDeferred = $q.defer();
        var sizesPromise = imagesApiService.getSizes().$promise;
        var mediaPathPromise = imagesApiService.getMediaPath().$promise;

        $q.all([sizesPromise, mediaPathPromise]).then(function(responses) {
            var sizesResponse = responses[0];
            var mediaPathResponse = responses[1];

            var sizes = {};
            if (sizesResponse.error === null && sizesResponse.result) {
                var sizesArr = sizesResponse.result.split(',');
                _.forEach(sizesArr, function(sizeItemStr) {
                    var sizeItem = sizeItemStr.split(':');
                    if (sizeItem.length === 2) {
                        sizes[sizeItem[0].trim()] = sizeItem[1].trim();
                    }
                });
            }

            var mediaPath = '/media';
            if (mediaPathResponse.error === null && mediaPathResponse.result ) {
                mediaPath = '/' + mediaPathResponse.result;
            }

            mediaParamsDeferred.resolve({
                sizes: sizes,
                mediaPath: mediaPath
            });
        });

        function getProductImage(_id, mediaName, size, mediaParams) {
            var mediaNameParts = mediaName.split('.');
            var ext = mediaNameParts.pop();
            var mediaNameWithSize = mediaNameParts.join('.') + '_' + mediaParams.sizes[size] + '.' + ext;
            return mediaParams.mediaPath + '/image/Product/' + _id + '/' + mediaNameWithSize;
        }

        function getSwatchImage(optionKey, selectionKey, mediaParams) {
            var swatchSize = '';
            if (mediaParams.sizes.swatch) {
                swatchSize = '_' + mediaParams.sizes.swatch;
            }
            return mediaParams.mediaPath + '/image/swatch/media/' + optionKey + '_' + selectionKey +
                swatchSize + SWATCH_EXT;
        }

        return {
            getMediaParams: function() {
                return mediaParamsDeferred.promise;
            },
            getProductImage: getProductImage,
            getSwatchImage: getSwatchImage,
            placeholder: PLACEHOLDER
        }
    }]);