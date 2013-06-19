(function() {
  define(['team'], function(Team) {
    return function(ui, $routeProvider) {
      return $routeProvider.when('/teams', {
        templateUrl: 'partials/teams.html',
        controller: [
          '$scope', function($scope) {
            $scope.addTeam = function() {
              var team, tournament;
              tournament = ui.tournament;
              team = new Team(tournament);
              return tournament.teams.push(team);
            };
            $scope.removeTeam = function(index) {
              var array;
              array = ui.tournament.teams;
              array[index].destroy();
              return array.splice(index, 1);
            };
            $scope.initRepeat = function(iScope) {
              return iScope.$watch(function() {
                return iScope.o.club;
              }, function(newValue, oldValue) {
                var team;
                if (newValue === oldValue) {
                  return;
                }
                team = iScope.o;
                if (oldValue) {
                  oldValue.removeTeam(team);
                }
                if (newValue) {
                  return newValue.addTeam(team);
                }
              });
            };
            return $scope.eliminateNil = function(a) {
              if (a == null) {
                return '';
              }
              return a;
            };
          }
        ]
      });
    };
  });

}).call(this);