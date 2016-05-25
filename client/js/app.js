var app = angular.module('codeBloxApp', []);
var serverSite = "http://755f89d9.ngrok.io";

app.controller('projectsController', function($http, $scope) {
    $scope.pictures = [
        {
            projName: "Blog",
            picName: "../images/blog.jpg"
        },
        {
            projName: "Forum",
            picName: "http://www.in-portal.com/system/user_files/Images/discussion_forum/screenshot_3a_big.jpg"
        },
        {
            projName: "Chat",
            picName: "../images/chat.JPG"
        },
        {
            projName: "Shop",
            picName: "../images/shop.jpg"
        }];
    
    $scope.projects = [
        {
            projName: "Chat",
            funcs: [{filename: "x.css", funcName: "css"}, 
                    {filename: "x.html", funcName: "HTML"},
                    {filename: "x.js", funcName: "AngularJS"}]
        },
        {
            projName: "Forum",
            funcs: [{filename: "x.js", funcName: "NodeJS"}, 
                    {filename: "x.html", funcName: "HTML"}]
        },
        {
            projName: "Blog",
            funcs: [{filename: "x.js", funcName: "NodeJS"}, 
                    {filename: "x.html", funcName: "HTML"}]
        },
        {
            projName: "Shop",
            funcs: [{filename: "x.js", funcName: "NodeJS"}, 
                    {filename: "x.html", funcName: "HTML"}]
        }
    ];
    
    $scope.getPic = function(projName) {
        var found = $scope.pictures.find(function(pic) {
            return pic.projName == projName;
        }).picName;
        
        console.log(found);
        
        return found;
    }
    
    $http.get(serverSite + '/projects').then(function(data){
        $scope.projects = data.data;
    }, function(){
        
    });
    
});

app.directive('cbProject', function($http){
    return {
        restrict: 'A',
        templateUrl: 'project.html',
        scope: {
          project: "="
        },
        link: function($scope){
            $scope.selected = { funcs : {} };
            
            $scope.sendSelectedFuncs = function(){
                  $http.post(serverSite + '/api/codeblox/', data).then(successCallback, errorCallback);
            };
        }
    };
});