'use strict';

angular.module('conFusion.services', ['ngResource'])
  .constant("baseURL","http://172.16.148.53:3000/")
  .factory('menuFactory',['$resource','baseURL',
    function($resource,baseURL) {





      return $resource(baseURL+"dishes/:id",null,
        {'update':
        {method:'PUT'}
        });
    }])

  .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
    return $resource(baseURL + "promotions/:id");

  }])

        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {


            return $resource(baseURL+"leadership/:id");

        }])

        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {


            return $resource(baseURL+"feedback/:id");

        }])
  .factory('favoriteFactory', ['$resource', 'baseURL','$localStorage', function ($resource, baseURL,$localStorage) {
    var favFac = {};
    var favorites = $localStorage.getObject('favorites', '[]');

    favFac.addToFavorites = function (index) {//添加我的喜爱函数
      for (var i = 0; i < favorites.length; i++) {//当新添加的项目在我的喜爱已经有的话就返回，
        if (favorites[i].id == index)
          return;
      }
      favorites.push({id: index});//favorites中没有的话，就把这个id为index的产品添加到afavorites中
      $localStorage.storeObject('favorites', favorites);
    };

    favFac.deleteFromFavorites = function (index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id == index) {
          favorites.splice(i, 1);//删除id为inde的菜单，当喜爱的菜单中的id是等于index的时候，从favorites中删除第i个，第二个参数为只删除1个
          $localStorage.storeObject('favorites', favorites);
        }
      }
    };

    favFac.getFavorites = function () {
      return favorites;
    };

    return favFac;
  }])

  .factory('$localStorage', ['$window', function($window) {
    return {
      store: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      storeObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key,defaultValue) {
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    }
  }])

;
