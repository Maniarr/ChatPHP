<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <link rel="stylesheet" href="<?php $this->asset('css/normalize.css'); ?>" charset="utf-8">
        <link rel="stylesheet" href="<?php $this->asset('css/foundation.min.css'); ?>" charset="utf-8">
        <link rel="stylesheet" href="<?php $this->asset('css/app.css'); ?>" charset="utf-8">
  
    <script type="text/javascript" src="<?php $this->asset('js/angular.min.js'); ?>"></script>
    <script type="text/javascript" src="<?php $this->asset('js/chatApp.js'); ?>"></script>
  </head>
  <body ng-app="chatApp" >      
    <div id="login" ng-controller="registerCtrl" class="row" ng-hide="hide">
          <div class="columns medium-6 medium-centered login">
              <h2 class="text-center">Chat</h2>
            <form name="registerForm" ng-submit="submit()">
                <input type="text" name="pseudo" value="" placeholder="Nickname" ng-model="pseudo" required>
                <button type="submit" ng-disabled="registerForm.pseudo.$error.required">Login</button>
              </form>
          </div>
        </div>
        <div ng-controller="chatCtrl"  class="row chat" style="background: #f5f5f5" ng-show="show">
          <div class="columns medium-4 contact-container">
            <div class="new_contact">
              <form ng-submit="addContact()">
                <input type="text" ng-model="new_contact" placeholder="Nickname of contact">
                <button type="submit" name="add_contact">Add</button>
              </form>
            </div>
            <ul id="contact">
              <li ng-repeat="contact in contacts | orderBy: ['-selected', '-notif'] : inverse" class="contact" ng-class="getClass(contact)" ng-click="selectContact(contact.id)">
                <h4>{{contact.name}}</h4>
              </li>
            </ul>
            </div>
            <div class="columns medium-8" style="background: #e1e1e1">
              <div id="message-container" class="message-container">
                <div ng-repeat="message in messages">
                  <div ng-if="message.author != user_name" class="message" >
                    <h5>{{message.author}} :</h5>
                    <p>{{
                    message.text}}</p>
                  </div>
                  <div ng-if="message.author == user_name"  class="message text-right bg-lightgray">
                    <p>{{message.text}}</p>
                  </div>
                </div>
              </div>
              <div id="send-container" class="send-container">
                <form ng-submit="sendMessage()">
                  <input id="message_input" ng-model="message_content" type="text">
                  <button type="submit" name="send">Send</button>
                  <div class="clear"></div>
                </form>
              </div>
            </div>
      </div>
  </body>
</html>