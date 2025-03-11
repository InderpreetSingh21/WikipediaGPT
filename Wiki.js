var app = angular.module('WikiApp', ['ngAnimate']);

app.controller('MainCtrl', function($scope, $http, $timeout) {
  var form = $('form');
  var close = $('.eks');
  var input = $('input');
  var search = $("#search");
  var help = $("#help");
  
  $scope.results = [];

  // Toggle the form and handle search reset
  close.on('click', function() {
    form.toggleClass('open');
    
    if (!form.hasClass('open') && $scope.searchTxt !== '' && typeof $scope.searchTxt !== 'undefined') {
      search.toggleClass('fullHeight');
      help.toggleClass('hide');
      $scope.searchTxt = '';
    }
    
    // Clear results when closing the form
    $scope.results = [];
    $scope.$apply();
  });

  // Focus input on form open
  input.on('transitionend webkitTransitionEnd oTransitionEnd', function() {
    if (form.hasClass('open')) {
      input.focus();
    }
  });

  // Search function that calls Wikipedia API
  $scope.search = function() {
    $scope.results = [];
    help.addClass('hide');
    search.removeClass('fullHeight');
    
    var title = $scope.searchTxt;  // Use Angular model for binding
    var api = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
    var cb = '&callback=JSON_CALLBACK';
    var page = 'https://en.wikipedia.org/?curid=';

    // API request with JSONP
    $http.jsonp(api + title + cb).then(function(response) {
      var results = response.data.query.pages;
      angular.forEach(results, function(v, k) {
        $scope.results.push({title: v.title, body: v.extract, page: page + v.pageid});
      });
    }).catch(function(error) {
      console.error('Error fetching data from Wikipedia:', error);
    });
  };
});
