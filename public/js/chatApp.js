var chatApp = angular.module('chatApp', []);
var url = "http://chat.maniarr.fr/";

chatApp.factory('userFactory', function()
{
	var name = "";
	var id = null

	var getUser = function()
	{
		return ({
			name: name,
			id: id
		});
	};

	var setUser = function(data)
	{
		name = data.name;
		id = data.id;
	};

	return ({
		getUser: getUser,
		setUser: setUser
	});
});

chatApp.controller('registerCtrl', ['$scope', '$rootScope', '$http', 'userFactory', function($scope, $rootScope, $http, userFactory)
{
	$scope.pseudo = "";
	$scope.hide = false;
	$scope.submit = function()
	{
		$http({
          method  : 'POST',
          url     : url + 'connect',
          data    : 'name=' + $scope.pseudo,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
        }).then(function(response)
		{
			userFactory.setUser(response.data);
			$rootScope.$broadcast('register', true);
			$scope.hide = true;
		});
	};
}]);

chatApp.controller('chatCtrl', ['$scope', '$http', '$interval', 'userFactory', function($scope, $http, $interval, userFactory)
{
	$scope.show = false;
	$scope.contacts = null;
	$scope.messages = null;
	$scope.select_room = null;

	$scope.selectContact = function(id)
	{
		$http({
	        method  : 'POST',
	        url     : url + 'message/last',
	        data    : 'room_id=' + id +'&member_id=' + userFactory.getUser().id,
	        headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
	    }).then(function(response)
		{
			$scope.messages = response.data;
			$scope.select_room = id;
			$scope.contacts.forEach(function(contact)
			{
				if (contact.id == id)
				{
					contact.selected = true;
					contact.notif = false;
				}
				else
					contact.selected = false;
			});
		});
	}

	$scope.$on('register', function(e)
	{
		$scope.show = true;

		$http({
	        method  : 'POST',
	        url     : url + 'chatroom',
	        data    : 'id=' + userFactory.getUser().id,
	        headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
	    }).then(function(response)
		{
			$scope.contacts = response.data;
			$scope.contacts.forEach(function(contact)
			{
				contact.notif = false;
				contact.selected = false;
			});
		});
		$scope.user_name = userFactory.getUser().name;
		$interval(get_notif, 1000);
	});

	var new_message = function()
	{
		if ($scope.select_room != null)
		{
			$http({
		        method  : 'POST',
		        url     : url + 'message/new',
		        data    : 'room_id=' + $scope.select_room +'&member_id=' + userFactory.getUser().id,
		        headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
		    }).then(function(response)
			{
				if (response.data[0] !== undefined)
				{
					$scope.messages.push(response.data[0]);
				}
			});
		}
	}

	$interval(new_message, 1000);

	var get_notif = function()
	{
		$http({
		    method  : 'POST',
		    url     : url + 'notif',
		    data    : 'member_id=' + userFactory.getUser().id,
		    headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
		}).then(function(response)
		{
			response.data.forEach(function(id)
			{
				var finded = false;
				$scope.contacts.forEach(function(contact)
				{
					if (contact.id == id)
					{
						contact.notif = true;
						finded = true;
					}
				});
				if (!finded)
				{
					$http({
						method  : 'POST',
						url     :  url + 'chatroom/name',
						data    : 'room_id=' + id,
						headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
					}).then(function(chatroom_response)
					{
						$scope.contacts.push({id: id, name: chatroom_response.data[0].name, notif: true});
					});
				}
			});
			
		});
	}
	
	$scope.sendMessage = function()
	{
		$http({
		    method  : 'POST',
		    url     : url + 'message/send',
		    data    : 'room_id=' + $scope.select_room +'&author_id=' + userFactory.getUser().id +'&author=' + userFactory.getUser().name + '&text=' + $scope.message_content,
		    headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
		}).then(function(response)
	    {

			$scope.messages.push({author: userFactory.getUser().name, text: $scope.message_content});
			$scope.message_content = "";
		});
	}

	$scope.getClass = function(contact)
	{
		if (contact.selected)
			return ('active-contact');
		else if (contact.notif)
			return ('notif');
		return;
	};

	$scope.addContact = function()
	{
		$http({
		    method  : 'POST',
		    url     : url + 'contact/add',
		    data    : 'member_id=' + userFactory.getUser().id +'&member=' + userFactory.getUser().name +'&contact=' + $scope.new_contact,
		    headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
		}).then(function(response)
	    {
	    	if (response.data.name != undefined)
	    	{
	    		$scope.contacts.push({name: response.data.name , id: response.data.id, notif: true});
				$scope.new_contact = "";
				$scope.selectContact(response.data.id);
	    	}
	    	else
	    	{
				$scope.new_contact = "User doesn't exist !";
	    	}
		});
	};
}]);