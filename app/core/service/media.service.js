angular.module('commonModule')

/**
 * Media helper service
 */
    .service('mediaService', ['_', '$q', 'mediaApiService', function(_, $q, imagesApiService) {
        var SWATCH_EXT = '.png';
        var PRODUCT_IMAGE_PLACEHOLDER = '/images/placeholder.png';

        var mediaConfigDeferred = $q.defer();

        activate();

        //////////////////////////////

        /**
         * Gets media settings from the server
         * Resolves mediaParamsDeferred with an object:
         * { sizes: { small: '100x100', large: '500x500' }, mediaPath: '/media' }
         */
        function activate() {
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

                mediaConfigDeferred.resolve({
                    sizes: sizes,
                    mediaPath: mediaPath
                });
            });
        }

        /**
         * Returns an url for a product image
         */
        function getProductImage(_id, mediaName, size, mediaParams) {
            var mediaNameParts = mediaName.split('.');
            var ext = mediaNameParts.pop();
            var mediaNameWithSize = mediaNameParts.join('.') + '_' + mediaParams.sizes[size] + '.' + ext;
            return mediaParams.mediaPath + '/image/Product/' + _id + '/' + mediaNameWithSize;
        }

        /**
         * Returns an url for a swatch item
         */
        function getSwatchImage(optionKey, selectionKey, mediaParams) {
            var swatchSize = '';
            if (mediaParams.sizes.swatch) {
                swatchSize = '_' + mediaParams.sizes.swatch;
            }
            return mediaParams.mediaPath + '/image/swatch/media/' + optionKey + '_' + selectionKey +
                swatchSize + SWATCH_EXT;
        }

        return {
            getMediaConfig: function() {
                return mediaConfigDeferred.promise;
            },
            getProductImage: getProductImage,
            getSwatchImage: getSwatchImage,
            productImagePlaceholder: PRODUCT_IMAGE_PLACEHOLDER
        }
    }]);