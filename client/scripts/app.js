var app = {

  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',

  currRoomName: 'default',

  init: function (data) {
  //**************************
  //**************************
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
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?order=-createdAt',
      type: 'GET',
      // data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
        var messageList = data.results;
        var filteredList = messageList.filter(function(item) {
          //screen for attacks
          return item.roomname === app.currRoomName; 
        })
        for (var obj of filteredList) {
          app.renderMessage(obj);
        }
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });  
  },

  renderMessage: function(message) {
    var element = $('<div class=\'messages\'></div>');
    $(element).text(`${message.username}: ${message.text}`);
    $('#chats').prepend(element);
  },

// 
  clearMessages: function(){
    $('#chats').empty();
  },

  renderRoom: function(roomName) {
    //when "New room..." in selector is chosen be able to add a new room to dropdown list
    // 
    var room = $(`<option value=${roomName}></option>`)
    $(room).text(`${roomName}`);
    $('#roomSelect').append(room);
  },

  handleSubmit: function() {
    var message = {};
    var user = window.location.search.slice(10);
    message.username = user;
    message.text = $('.input').val();
    message.roomname = app.currRoomName;
    app.send(message);
    $('.input').val('');
    app.renderMessage(message);  
  }
};

$(document).ready(function() {
  $('#roomSelect').on('change', function() {
    app.clearMessages();
    app.currRoomName = $('#roomSelect').val();
    app.fetch();
  })

  $('.submit').on('click', function() {
    app.handleSubmit();
  })

});

// $(document).ready(function() {

//   $('.messages').on('click', function () {
//     $(`.${message.username}`).toggleClass('.friend');
//   })  

//   $('#roomSelect').change(function() {

// // })
// });
//})
  //toggleClass friend



