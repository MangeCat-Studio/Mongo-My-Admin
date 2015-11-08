var app = angular.module('myApp', []);


app.controller('customersCtrl', function($scope, $http) {
	console.log("controller connected");

function refresh(){ 
// create contacklist route 
$http.get('/databases').success(function(response) {
    console.log("recived data requested");
    $scope.databases = response;             // init databases from get response
    $scope.DB_NAME = "Select a Database " ;  // init DB_NAME 
  });
}

// Call refresh to init cantacklist 
refresh(); 


$scope.editDB = function(contactItem) {
  console.log(contactItem);
    $http.post('/collection', JSON.stringify({'contactItem': contactItem})).success(function(response) {
      $scope.DB_NAME = contactItem; 
      $scope.objs = response ; 
      console.log("posted: "+response);
      });
  };

$scope.dropDB = function(contactItem) {
  console.log("Drop: "+contactItem);
  };

$scope.viewCollection = function(contactItem) {
  console.log("View: "+contactItem);
  var objson = {'DB':$scope.DB_NAME,'contactItem':contactItem};  

   $http.post('/viewcollection',objson).success(function(response) {
      console.log("----- posted: -----");
      console.log("response: "+response);
      console.log("------------");
      var array = response ; 
      array.forEach(function(entry) {
          console.log(entry);
      });

      });
  };



});// Controller 