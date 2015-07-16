angular.module("visitorModule")

    .controller('visitorAddressController', [
        '$scope',
        '$location',
        '$visitorLoginService',
        '$visitorApiService',
        '$designStateService',
        '$commonUtilService',
        function ($scope, $location, $visitorLoginService, $visitorApiService, $designStateService, $commonUtilService) {
            var getFullName;

            $scope.countries = [
                { Code: "AF", Name: "Afghanistan" },
                { Code: "AX", Name: "Åland Islands" },
                { Code: "AL", Name: "Albania" },
                { Code: "DZ", Name: "Algeria" },
                { Code: "AS", Name: "American Samoa" },
                { Code: "AD", Name: "Andorra" },   
                { Code: "AO", Name: "Angola" },
                { Code: "AI", Name: "Anguilla" },
                { Code: "AQ", Name: "Antarctica" },
                { Code: "AG", Name: "Antigua and Barbuda" },
                { Code: "AR", Name: "Argentina" },
                { Code: "AM", Name: "Armenia" },
                { Code: "AW", Name: "Aruba" },
                { Code: "AU", Name: "Australia" },
                { Code: "AT", Name: "Austria" },
                { Code: "AZ", Name: "Azerbaijan" },
                { Code: "BS", Name: "Bahamas" },
                { Code: "BH", Name: "Bahrain" },
                { Code: "BD", Name: "Bangladesh" },
                { Code: "BB", Name: "Barbados" },
                { Code: "BY", Name: "Belarus" },
                { Code: "BE", Name: "Belgium" },
                { Code: "BZ", Name: "Belize" },
                { Code: "BJ", Name: "Benin" },
                { Code: "BM", Name: "Bermuda" },
                { Code: "BT", Name: "Bhutan" },
                { Code: "BO", Name: "Bolivia" },
                { Code: "BA", Name: "Bosnia and Herzegovina" },
                { Code: "BW", Name: "Botswana" },
                { Code: "BV", Name: "Bouvet Island" },
                { Code: "BR", Name: "Brazil" },
                { Code: "IO", Name: "British Indian Ocean Territory" },
                { Code: "VG", Name: "British Virgin Islands" },
                { Code: "BN", Name: "Brunei" },
                { Code: "BG", Name: "Bulgaria" },
                { Code: "BF", Name: "Burkina Faso" },
                { Code: "BI", Name: "Burundi" },
                { Code: "KH", Name: "Cambodia" },
                { Code: "CM", Name: "Cameroon" },
                { Code: "CA", Name: "Canada" },
                { Code: "CV", Name: "Cape Verde" },
                { Code: "KY", Name: "Cayman Islands" },
                { Code: "CF", Name: "Central African Republic" },
                { Code: "TD", Name: "Chad" },
                { Code: "CL", Name: "Chile" },
                { Code: "CN", Name: "China" },
                { Code: "CX", Name: "Christmas Island" },
                { Code: "CC", Name: "Cocos [Keeling] Islands" },
                { Code: "CO", Name: "Colombia" },
                { Code: "KM", Name: "Comoros" },
                { Code: "CG", Name: "Congo - Brazzaville" },
                { Code: "CD", Name: "Congo - Kinshasa" },
                { Code: "CK", Name: "Cook Islands" },
                { Code: "CR", Name: "Costa Rica" },
                { Code: "CI", Name: "Côte d’Ivoire" },
                { Code: "HR", Name: "Croatia" },
                { Code: "CU", Name: "Cuba" },
                { Code: "CY", Name: "Cyprus" },
                { Code: "CZ", Name: "Czech Republic" },
                { Code: "DK", Name: "Denmark" },
                { Code: "DJ", Name: "Djibouti" },
                { Code: "DM", Name: "Dominica" },
                { Code: "DO", Name: "Dominican Republic" },
                { Code: "EC", Name: "Ecuador" },
                { Code: "EG", Name: "Egypt" },
                { Code: "SV", Name: "El Salvador" },
                { Code: "GQ", Name: "Equatorial Guinea" },
                { Code: "ER", Name: "Eritrea" },
                { Code: "EE", Name: "Estonia" },
                { Code: "ET", Name: "Ethiopia" },
                { Code: "FK", Name: "Falkland Islands" },
                { Code: "FO", Name: "Faroe Islands" },
                { Code: "FJ", Name: "Fiji" },
                { Code: "FI", Name: "Finland" },
                { Code: "FR", Name: "France" },
                { Code: "GF", Name: "French Guiana" },
                { Code: "PF", Name: "French Polynesia" },
                { Code: "TF", Name: "French Southern Territories" },
                { Code: "GA", Name: "Gabon" },
                { Code: "GM", Name: "Gambia" },
                { Code: "GE", Name: "Georgia" },
                { Code: "DE", Name: "Germany" },
                { Code: "GH", Name: "Ghana" },
                { Code: "GI", Name: "Gibraltar" },
                { Code: "GR", Name: "Greece" },
                { Code: "GL", Name: "Greenland" },
                { Code: "GD", Name: "Grenada" },
                { Code: "GP", Name: "Guadeloupe" },
                { Code: "GU", Name: "Guam" },
                { Code: "GT", Name: "Guatemala" },
                { Code: "GG", Name: "Guernsey" },
                { Code: "GN", Name: "Guinea" },
                { Code: "GW", Name: "Guinea-Bissau" },
                { Code: "GY", Name: "Guyana" },
                { Code: "HT", Name: "Haiti" },
                { Code: "HM", Name: "Heard Island and McDonald Islands" },
                { Code: "HN", Name: "Honduras" },
                { Code: "HK", Name: "Hong Kong SAR China" },
                { Code: "HU", Name: "Hungary" },
                { Code: "IS", Name: "Iceland" },
                { Code: "IN", Name: "India" },
                { Code: "ID", Name: "Indonesia" },
                { Code: "IR", Name: "Iran" },
                { Code: "IQ", Name: "Iraq" },
                { Code: "IE", Name: "Ireland" },
                { Code: "IM", Name: "Isle of Man" },
                { Code: "IL", Name: "Israel" },
                { Code: "IT", Name: "Italy" },
                { Code: "JM", Name: "Jamaica" },
                { Code: "JP", Name: "Japan" },
                { Code: "JE", Name: "Jersey" },
                { Code: "JO", Name: "Jordan" },
                { Code: "KZ", Name: "Kazakhstan" },
                { Code: "KE", Name: "Kenya" },
                { Code: "KI", Name: "Kiribati" },
                { Code: "KW", Name: "Kuwait" },
                { Code: "KG", Name: "Kyrgyzstan" },
                { Code: "LA", Name: "Laos" },
                { Code: "LV", Name: "Latvia" },
                { Code: "LB", Name: "Lebanon" },
                { Code: "LS", Name: "Lesotho" },
                { Code: "LR", Name: "Liberia" },
                { Code: "LY", Name: "Libya" },
                { Code: "LI", Name: "Liechtenstein" },
                { Code: "LT", Name: "Lithuania" },
                { Code: "LU", Name: "Luxembourg" },
                { Code: "MO", Name: "Macau SAR China" },
                { Code: "MK", Name: "Macedonia" },
                { Code: "MG", Name: "Madagascar" },
                { Code: "MW", Name: "Malawi" },
                { Code: "MY", Name: "Malaysia" },
                { Code: "MV", Name: "Maldives" },
                { Code: "ML", Name: "Mali" },
                { Code: "MT", Name: "Malta" },
                { Code: "MH", Name: "Marshall Islands" },
                { Code: "MQ", Name: "Martinique" },
                { Code: "MR", Name: "Mauritania" },
                { Code: "MU", Name: "Mauritius" },
                { Code: "YT", Name: "Mayotte" },
                { Code: "MX", Name: "Mexico" },
                { Code: "FM", Name: "Micronesia" },
                { Code: "MD", Name: "Moldova" },
                { Code: "MC", Name: "Monaco" },
                { Code: "MN", Name: "Mongolia" },
                { Code: "ME", Name: "Montenegro" },
                { Code: "MS", Name: "Montserrat" },
                { Code: "MA", Name: "Morocco" },
                { Code: "MZ", Name: "Mozambique" },
                { Code: "MM", Name: "Myanmar [Burma]" },
                { Code: "NA", Name: "Namibia" },
                { Code: "NR", Name: "Nauru" },
                { Code: "NP", Name: "Nepal" },
                { Code: "NL", Name: "Netherlands" },
                { Code: "AN", Name: "Netherlands Antilles" },
                { Code: "NC", Name: "New Caledonia" },
                { Code: "NZ", Name: "New Zealand" },
                { Code: "NI", Name: "Nicaragua" },
                { Code: "NE", Name: "Niger" },
                { Code: "NG", Name: "Nigeria" },
                { Code: "NU", Name: "Niue" },
                { Code: "NF", Name: "Norfolk Island" },
                { Code: "MP", Name: "Northern Mariana Islands" },
                { Code: "KP", Name: "North Korea" },
                { Code: "NO", Name: "Norway" },
                { Code: "OM", Name: "Oman" },
                { Code: "PK", Name: "Pakistan" },
                { Code: "PW", Name: "Palau" },
                { Code: "PS", Name: "Palestinian Territories" },
                { Code: "PA", Name: "Panama" },
                { Code: "PG", Name: "Papua New Guinea" },
                { Code: "PY", Name: "Paraguay" },
                { Code: "PE", Name: "Peru" },
                { Code: "PH", Name: "Philippines" },
                { Code: "PN", Name: "Pitcairn Islands" },
                { Code: "PL", Name: "Poland" },
                { Code: "PT", Name: "Portugal" },
                { Code: "PR", Name: "Puerto Rico" },
                { Code: "QA", Name: "Qatar" },
                { Code: "RE", Name: "Réunion" },
                { Code: "RO", Name: "Romania" },
                { Code: "RU", Name: "Russia" },
                { Code: "RW", Name: "Rwanda" },
                { Code: "BL", Name: "Saint Barthélemy" },
                { Code: "SH", Name: "Saint Helena" },
                { Code: "KN", Name: "Saint Kitts and Nevis" },
                { Code: "LC", Name: "Saint Lucia" },
                { Code: "MF", Name: "Saint Martin" },
                { Code: "PM", Name: "Saint Pierre and Miquelon" },
                { Code: "VC", Name: "Saint Vincent and the Grenadines" },
                { Code: "WS", Name: "Samoa" },
                { Code: "SM", Name: "San Marino" },
                { Code: "ST", Name: "São Tomé and Príncipe" },
                { Code: "SA", Name: "Saudi Arabia" },
                { Code: "SN", Name: "Senegal" },
                { Code: "RS", Name: "Serbia" },
                { Code: "SC", Name: "Seychelles" },
                { Code: "SL", Name: "Sierra Leone" },
                { Code: "SG", Name: "Singapore" },
                { Code: "SK", Name: "Slovakia" },
                { Code: "SI", Name: "Slovenia" },
                { Code: "SB", Name: "Solomon Islands" },
                { Code: "SO", Name: "Somalia" },
                { Code: "ZA", Name: "South Africa" },
                { Code: "GS", Name: "South Georgia and the South Sandwich Islands" },
                { Code: "KR", Name: "South Korea" },
                { Code: "ES", Name: "Spain" },
                { Code: "LK", Name: "Sri Lanka" },
                { Code: "SD", Name: "Sudan" },
                { Code: "SR", Name: "Suriname" },
                { Code: "SJ", Name: "Svalbard and Jan Mayen" },
                { Code: "SZ", Name: "Swaziland" },
                { Code: "SE", Name: "Sweden" },
                { Code: "CH", Name: "Switzerland" },
                { Code: "SY", Name: "Syria" },
                { Code: "TW", Name: "Taiwan" },
                { Code: "TJ", Name: "Tajikistan" },
                { Code: "TZ", Name: "Tanzania" },
                { Code: "TH", Name: "Thailand" },
                { Code: "TL", Name: "Timor-Leste" },
                { Code: "TG", Name: "Togo" },
                { Code: "TK", Name: "Tokelau" },
                { Code: "TO", Name: "Tonga" },
                { Code: "TT", Name: "Trinidad and Tobago" },
                { Code: "TN", Name: "Tunisia" },
                { Code: "TR", Name: "Turkey" },
                { Code: "TM", Name: "Turkmenistan" },
                { Code: "TC", Name: "Turks and Caicos Islands" },
                { Code: "TV", Name: "Tuvalu" },
                { Code: "UG", Name: "Uganda" },
                { Code: "UA", Name: "Ukraine" },
                { Code: "AE", Name: "United Arab Emirates" },
                { Code: "GB", Name: "United Kingdom" },
                { Code: "US", Name: "United States" },
                { Code: "UY", Name: "Uruguay" },
                { Code: "UM", Name: "U.S. Minor Outlying Islands" },
                { Code: "VI", Name: "U.S. Virgin Islands" },
                { Code: "UZ", Name: "Uzbekistan" },
                { Code: "VU", Name: "Vanuatu" },
                { Code: "VA", Name: "Vatican City" },
                { Code: "VE", Name: "Venezuela" },
                { Code: "VN", Name: "Vietnam" },
                { Code: "WF", Name: "Wallis and Futuna" },
                { Code: "EH", Name: "Western Sahara" },
                { Code: "YE", Name: "Yemen" },
                { Code: "ZM", Name: "Zambia" },
                { Code: "ZW", Name: "Zimbabwe" }
            ];
            $scope.states = $designStateService;
            $scope.addresses = [];
            $scope.address = {};
            $scope.visitor = $visitorLoginService.getVisitor();
            $scope.visitorService = $visitorLoginService;
            var activePath;

            getFullName = function (obj) {
                return obj["zip_code"] +
                    ' ' + obj["state"] +
                    ', ' + obj["city"] +
                    ', ' + obj["address_line1"] +
                    (obj["address_line2"] ? ', ' + obj["address_line2"] : '');
            };

            $scope.init = function () {
                // BREADCRUMBS
                $scope.$emit('add-breadcrumbs', {'label': 'myAccount', 'url': '/account'});
                $scope.$emit('add-breadcrumbs', {'label': 'Addresses', 'url': '/account/address'});

                activePath = $location.path();

                $scope.visitorService.isLoggedIn().then(function (isLoggedIn) {
                    if (!isLoggedIn) {
                        $location.path("/");
                    }
                });
            };

            /**
             * Clears the form to create a new address
             */
            $scope.clearForm = function () {
                $scope.address = {'visitor_id': $scope.visitor._id};
                $scope.submitted = false;
            };

            $scope.clearForm();

            $visitorApiService.getAddresses().$promise.then(
                function (response) {
                    var result = response.result || [];
                    $scope.addresses = result;
                }
            );


            /**
             * Handler event when selecting the address in the list
             *
             * @param id
             */
            $scope.select = function (addressId) {
                $visitorApiService.loadAddress({'addressID': addressId}).$promise.then(
                    function (response) {
                        var result = response.result || {};
                        $scope.address = result;
                        $scope.address.Id = result._id;
                        $scope.address.Name = getFullName(result);
                    });
            };

            /**
             * Removes address by ID
             *
             * @param {string} id
             */
            $scope.remove = function (id) {
                var i, answer;
                answer = window.confirm('You really want to remove this address');
                if (answer) {
                    $visitorApiService.deleteAddress({'addressID': id}, function (response) {
                        if (response.result === 'ok') {
                            for (i = 0; i < $scope.addresses.length; i += 1) {
                                if ($scope.addresses[i].ID === id) {
                                    $scope.addresses.splice(i, 1);
                                    $scope.clearForm();
                                }
                            }
                        }
                    });
                }
            };

            $scope.setAsDefault = function (id) {
                $visitorApiService.update({'shipping_address_id': id}).$promise.then(
                    function (response) {
                        $visitorLoginService.setLogin(response.result);
                        $scope.visitor = $visitorLoginService.getVisitor();
                        $scope.message = $commonUtilService.getMessage(null, 'success', 'Address was selected as default with success');
                    }
                );
            };

            $scope.save = function () {
                var id, saveSuccess, saveError, updateSuccess, updateError;
                $scope.submitted = true;

                if (this.addressForm.$invalid) {
                    return false;
                }

                if (typeof $scope.address !== 'undefined') {
                    id = $scope.address.id || $scope.address._id;
                }

                /**
                 *
                 * @param response
                 */
                saveSuccess = function (response) {
                    if (response.error === null) {
                        $scope.addresses.push({
                                'ID': response.result._id,
                                'Name': getFullName(response.result)
                            }
                        );
                    }
                    $('#parent_popup_address').modal("hide");
                    $scope.submitted = false;
                    $scope.message = $commonUtilService.getMessage(null, 'success', 'New address was added with success');
                };

                /**
                 *
                 * @param response
                 */
                saveError = function () {
                };

                /**
                 *
                 * @param response
                 */
                updateSuccess = function (response) {
                    var i, addr;
                    if (response.error === null) {
                        addr = response.result;
                        for (i = 0; i < $scope.addresses.length; i += 1) {
                            if ($scope.addresses[i].ID === addr._id) {
                                $scope.addresses[i].ID = addr._id;
                                $scope.addresses[i].Name = getFullName(addr);
                            }
                        }
                    }
                    $('#parent_popup_address').modal('hide');
                    $scope.submitted = false;
                    $scope.message = $commonUtilService.getMessage(null, 'success', 'Address was changed with success');
                };

                /**
                 *
                 * @param response
                 */
                updateError = function () {
                };

                if (!id) {
                    $scope.address["visitor_id"] = $visitorLoginService.getVisitorId();
                    $visitorApiService.saveAddress($scope.address, saveSuccess, saveError);
                } else {
                    $scope.address.id = id;
                    $visitorApiService.addressUpdate($scope.address, updateSuccess, updateError);
                }
            };

            $scope.popUpOpen = function (addressId) {
                if (typeof addressId === 'undefined') {
                    $scope.clearForm();
                    $('#parent_popup_address').modal('show');
                } else {
                    $visitorApiService.loadAddress({'addressID': addressId}).$promise.then(
                        function (response) {
                            $scope.address = response.result || [];

                            var shippingAddressId = (typeof $scope.visitor["shipping_address"] !== 'undefined' && $scope.visitor["shipping_address"] !== null) ?
                                $scope.visitor["shipping_address"]._id : null;
                            var billingAddressId = (typeof $scope.visitor["billing_address"] !== 'undefined' && $scope.visitor["billing_address"] !== null) ?
                                $scope.visitor["billing_address"]._id : null;
                            $scope.useAsDefaultShipping = (shippingAddressId && shippingAddressId === $scope.address._id) ? true : false;
                            $scope.useAsDefaultBilling = (billingAddressId && billingAddressId === $scope.address._id) ? true : false;

                            $('#parent_popup_address').modal('show');

                        }
                    );
                }
            };


            $scope.changeShippingAsDefault = function (id) {
                delete $scope.visitor["billing_address"];
                delete $scope.visitor["shipping_address"];
                delete $scope.visitor["password"];

                if (!$scope.useAsDefaultShipping) {
                    $scope.visitor["shipping_address_id"] = "";
                } else {
                    $scope.visitor["shipping_address_id"] = id;
                }

                $visitorApiService.update($scope.visitor).$promise.then(
                    function (response) {
                        $visitorLoginService.setLogin(response.result);
                        $scope.visitor = $visitorLoginService.getVisitor();
                    }
                );
            };

            $scope.changeBillingAsDefault = function (id) {
                delete $scope.visitor["billing_address"];
                delete $scope.visitor["shipping_address"];
                delete $scope.visitor["password"];

                if (!$scope.useAsDefaultBilling) {
                    $scope.visitor["billing_address_id"] = "";
                } else {
                    $scope.visitor["billing_address_id"] = id;
                }
                $visitorApiService.update($scope.visitor).$promise.then(
                    function (response) {
                        $visitorLoginService.setLogin(response.result);
                        $scope.visitor = $visitorLoginService.getVisitor();
                    }
                );
            };

            $scope.getAddressName = function (addr) {
                var _default, name;
                name = addr.Name;
                _default = [];
                if (typeof $scope.visitor["billing_address"] !== 'undefined' &&
                    $scope.visitor["billing_address"] !== null &&
                    addr.ID === $scope.visitor["billing_address"]._id) {
                    _default.push('default billing');
                }
                if (typeof $scope.visitor["shipping_address"] !== 'undefined' &&
                    $scope.visitor["shipping_address"] !== null &&
                    addr.ID === $scope.visitor["shipping_address"]._id) {
                    _default.push('default shipping');
                }

                if (_default.length > 0) {
                    name += '( ' + _default.join(', ') + ')';
                }

                return name;
            };

            $scope.isActive = function (path) {
                if (activePath === path) {
                    $('.account-menu ul li:first-child').find('span')
                        .css('background', 'url("themes/default/images/tablet/tabL.jpg") no-repeat top left');
                    return true;
                }
                return false;
            };
        }
    ]);