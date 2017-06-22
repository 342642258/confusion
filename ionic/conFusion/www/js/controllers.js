angular.module('conFusion.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo', '{}');
    $scope.reservation = {};
    $scope.comments = {};
    $scope.registration = {};

    // Create the login modal that we will use later


    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.reserveform = modal
    });

    $scope.reserve = function () {
      $scope.reserveform.show();
    };

    $scope.closeReserve = function () {
      $scope.reserveform.hide();
    };
    $scope.doReserve = function () {
      console.log('Doing reservation', $scope.reservation);

      $timeout(function () {
        $scope.closeReserve();
      }, 1000);
    };


    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
      $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
      $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
      // Simulate a registration delay. Remove this and replace with your registration
      // code if using a registration system
      $timeout(function () {
        $scope.closeRegister();
      }, 1000);
    };

    $ionicPlatform.ready(function () {
      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };


      $scope.takePicture = function () {
        $cordovaCamera.getPicture(options).then(function (imageData) {
          $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
        }, function (err) {
          console.log(err);
        });
        var option = {
          maximumImagesCount: 10,
          width: 800,
          height: 800,
          quality: 80
        };

        $scope.takePictures = function () {
          $cordovaImagePicker.getPictures(option)
            .then(function (results) {
              for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]);
              }
            }, function (error) {
              // error getting photos
            });
        };
        $scope.registerform.show();

      };
      var optionsCordovaImagePicker = {
        maximumImagesCount: 1,
        width: 100,
        height: 100,
        quality: 50
      };

      $scope.takePictures = function () {
        $cordovaImagePicker.getPictures(optionsCordovaImagePicker)
          .then(function (results) {
            $scope.registration.imgSrc = results[0];
          }, function (error) {
            console.log(error);
          });
      };


    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);
      $localStorage.storeObject('userinfo', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })
  .controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    $scope.dishes = dishes;


    $scope.select = function (setTab) {
      $scope.tab = setTab;

      if (setTab === 2) {
        $scope.filtText = "appetizer";
      }
      else if (setTab === 3) {
        $scope.filtText = "mains";
      }
      else if (setTab === 4) {
        $scope.filtText = "dessert";
      }
      else {
        $scope.filtText = "";
      }
    };

    $scope.isSelected = function (checkTab) {
      return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
      $scope.showDetails = !$scope.showDetails;
    };

    $scope.addFavorite = function (index) {
      console.log("index is " + index);
      favoriteFactory.addToFavorites(index);
      $ionicListDelegate.closeOptionButtons();

      $ionicPlatform.ready(function () {
        $cordovaLocalNotification.schedule({
          id: 1,
          title: "Added Favorite",
          text: $scope.dishes[index].name
        }).then(function () {
          console.log('Added Favorite' + $scope.dishes[index].name);
        }, function () {
          console.log('Failed to add Favorite');
        });
        $cordovaToast
          .show('Added Favorite ' + $scope.dishes[index].name, 'long', 'center')
          .then(function (success) {
            // success
          }, function (error) {
            // error
          });
      });

    }

  }])

  .controller('ContactController', ['$scope', function ($scope) {

    $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};

    var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

  }])

  .controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.sendFeedback = function () {

      console.log($scope.feedback);

      if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
        $scope.invalidChannelSelection = true;
        console.log('incorrect');
      }
      else {
        $scope.invalidChannelSelection = false;
        feedbackFactory.save($scope.feedback);
        $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
        $scope.feedback.mychannel = "";
        $scope.feedbackForm.$setPristine();
        console.log($scope.feedback);
      }
    };
  }])

  .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.dish = {};
    $scope.showDish = false;
    $scope.message = "Loading ...";
    $scope.id = "";

    $scope.dish = dish;
    //$scope.dish = menuFactory.get({id:parseInt($stateParams.id,10)})
    //  .$promise.then(
    //    function(response){
    //      $scope.dish = response;
    //      $scope.showDish = true;
    //    },
    //    function(response){
    //      $scope.message = "Error: "+response.status + " " + response.statusText;
    //    }
    //  );


    $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;

      $scope.addFavorite = function (id) {
        console.log("index is " + (id));

        favoriteFactory.addToFavorites(id);


        $ionicPlatform.ready(function () {
          $cordovaLocalNotification.schedule({
            id: 1,
            title: "Added Favorite",
            text: $scope.dish.name
          }).then(function () {
            console.log('Added Favorite' + $scope.dish.name);
          }, function () {
            console.log('Failed to add Favorite');
          });
          $cordovaToast
            .show('Added Favorite ' + $scope.dish.name, 'long', 'center')
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        });
        $scope.closePopover();
      }

    });


    $scope.closePopover = function () {
      console.log("closefun");
      $scope.popover.hide();
    };

    // Create the Comment modal
    $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.commentForm = modal;
    });

    $scope.doComment = function () {
      console.log("comment modal");
      $scope.closePopover();
      //  $scope.popover.close();
      $scope.commentForm.show();
    };
    $scope.closeComment = function () {
      $scope.commentForm.hide();
    };


    $scope.feedback = {rating: 5, comment: "", author: "", date: ""};

    $scope.addComment = function () {
      console.log("inside modal");

      $scope.feedback.date = new Date().toISOString();
      console.log($scope.feedback);

      $scope.dish.comments.push($scope.feedback);
      menuFactory.update({id: $scope.dish.id}, $scope.dish);

      //Need to check this $scope.commentForm.$setPristine();

      $scope.feedback = {rating: 5, comment: "", author: "", date: ""};
      $scope.commentForm.hide();
    };

  }])

  .controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

    $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};

    $scope.submitComment = function () {

      $scope.mycomment.date = new Date().toISOString();
      console.log($scope.mycomment);

      $scope.dish.comments.push($scope.mycomment);
      menuFactory.update({id: $scope.dish.id}, $scope.dish);

      $scope.commentForm.$setPristine();

      $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};
    }
  }])

  // implement the IndexController and About Controller here

  .controller('IndexController', ['$scope', 'dish', 'promotion', 'corporate', 'baseURL', function ($scope, dish, promotion, corporate, baseURL) {
    $scope.baseURL = baseURL;
    $scope.leader = corporate
    $scope.showDish = false;
    $scope.message = "Loading ...";
    $scope.dish = dish;
    $scope.promotion = promotion;

  }])

  .controller('AboutController', ['$scope', 'corporate', 'baseURL', function ($scope, corporate, baseURL) {
    $scope.baseURL = baseURL;
    $scope.leaders = corporate;
    console.log($scope.leaders);

  }])

  .controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$cordovaVibration', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $cordovaVibration) {
    //
    // $scope.baseURL = baseURL;//添加baseURL为scope范围内可用
    //
    // $scope.shouldShowDelete = false;
    //
    // $ionicLoading.show({//覆盖页面加载中
    //   template:'<ion-spinner></ion-spinner> Loading...'
    // });
    //
    // $scope.favorites = favoriteFactory.getFavorites();//从favoriteFacrtory中调用get函数，来获取favorites
    //
    //$scope.dishes = menuFactory.query(//从menuFactory或者getDishes函数，query是查询功能，是否有
    //   function(response) {
    //
    //     $scope.dishes = response;
    //
    //    $timeout(function(){//1秒钟后关闭
    //      $ionicLoading.hide();
    //    },1000);
    //   },
    //   function(response) {
    //     $scope.message = "Error: "+response.status + " " + response.statusText;//获取不到显示就显示
    //     $timeout(function(){
    //       $ionicLoading.hide();
    //     },1000);
    //   });
    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    $scope.favorites = favorites;

    $scope.dishes = dishes;

    console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
      $scope.shouldShowDelete = !$scope.shouldShowDelete;//反转显示，
      console.log($scope.shouldShowDelete);
    }

    $scope.deleteFavorite = function (index) {

      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirm Delete',
        template: 'Are you sure you want to delete this item?'
      });

      confirmPopup.then(function (res) {
        if (res) {
          console.log('Ok to delete');
          favoriteFactory.deleteFromFavorites(index);
          $cordovaVibration.vibrate(100);
        } else {
          console.log('Canceled delete');
        }
      });

      $scope.shouldShowDelete = false;

    }

  }])

  .filter('favoriteFilter', function () {//创建自定义过滤器
    return function (dishes, favorites) {//第一个参数是哪个数组需要你去过滤，第二个参数就是你申请的过滤器
      var out = [];
      for (var i = 0; i < favorites.length; i++) {
        for (var j = 0; j < dishes.length; j++) {
          if (dishes[j].id === favorites[i].id)//三个等号的意思是同等，连数据类型也要一样
            out.push(dishes[j]);
        }
      }
      return out;
    }
  })
;
