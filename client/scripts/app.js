var app = {

  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',

  currRoomName: 'default',

  friends: [],

  init: function (data) {
  //**************************
  //**************************
    $('#roomSelect').on('change', function() {
      app.clearMessages();
      app.currRoomName = $('#roomSelect').val();
      app.fetch();
    });
    
    $('.submit').on('submit', this.handleSubmit.bind(this));

    $('#chat').click(this.handleUsernameClick.bind(this));
    
    $('.roomSubmit').on('click', this.handleNewRoom.bind(this));
    
    setInterval(this.fetch.bind(this), 1000);
    
  },

  send: function(message) {
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });

  },

  fetch: function() {
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: 'order=-createdAt',
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
        app.clearMessages();
        var messageList = data.results;
        var filteredList = messageList.filter(function(item) {
          //screen for attacks
          return item.roomname === app.currRoomName; 
        });
        for (var obj of filteredList) {
          app.renderMessage(obj);
        }
        
        var roomList = messageList.map(function(item) {
          return item.roomname;
        });
        var uniqueRooms = _.uniq(roomList);
        for (var rooms of uniqueRooms) {
          app.renderRoom(rooms);
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });  
  },

  renderMessage: function(message) {
    var element = $('<div class="chat"></div>');
    var username = `<span class='username'> ${message.username}</span>`;
    var text = `<span class='text'> ${message.text}</span>`;
    $(element).append(`${username}: ${text}`);

    $('#chat').append(element);
  },


  clearMessages: function() {
    $('#chat').empty();
  },

  renderRoom: function(roomName) {
    var room = $(`<option value=${roomName}></option>`);
    $(room).text(`${roomName}`);
    $('#roomSelect').append(room);
  },

  handleSubmit: function(e) {
    var message = {};
    var user = window.location.search.slice(10);
    message.username = user;
    message.text = $('.input').val();
    message.roomname = app.currRoomName;
    this.send(message);
    $('.input').val('');
    this.renderMessage(message); 
    e.preventDefault();
  },

  handleUsernameClick: function() {
    var user = window.location.search.slice(10);
    $('.text').toggleClass('friend');
  },
  
  handleNewRoom: function(e) {
    var newRoom = $('.newRoomText').val();
    this.renderRoom(newRoom);
    $('.newRoomText').val('');    
  }
};

$(document).ready(function() {
  app.init();
});