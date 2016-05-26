var app = angular.module('codeBloxApp', []);
var serverSite = "http://40.127.177.147:3000";

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
        },
        {
            projName: "students",
            picName: "../images/shop.jpg"
        },
        {
            projName: "test",
            picName: "../images/website.jpg"
        }];
    
    $scope.getPic = function(projName) {
        var found = $scope.pictures.find(function(pic) {
            return pic.projName == projName;
        });
        
        var returnValue = '';

        if (found) {
            returnValue = found.picName;
        }

        return returnValue;
    }
    
    $http.get(serverSite + '/api/projects').then(function(data){
        $scope.projects = data.data;
    });
    
});

app.directive('cbProject', function($http){
    return {
        restrict: 'A',
        templateUrl: 'project.html',
        scope: {
          project: "="
        },
        link: function($scope) {
            $scope.attr = [];
            $scope.selected = { funcs : {} };
            
            $scope.sendSelected = function() {
                for (attr in $scope.selected.funcs) {
                    if ($scope.selected.funcs[attr]) {
                        $scope.attr.push(attr);
                    }
                }
                
                $http.post(serverSite + '/api/codeblox/' + $scope.project.name, {funcs: $scope.attr})
                .then(function (result) {
                    var blob = new Blob([result.data]);
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = $scope.project.name + ".zip";
                    link.click();
                });
            }
        }
    }
});