$(document).ready(function()
{/*
  var pseudo = 'pseudo1';
  $('#login').hide();
  $('#chat').show();
  get_contact();
  get_last_message();
*/

  var pseudo = null;
  var contact_select = null;

  $('button[name=login]').click(function()
  {
    pseudo = $('input[name=pseudo]').val();

    if (pseudo == '')
      $('.error').text('Please complete the fields !');
    else
    {
      $('#login').hide();
      $('#chat').show();

      get_contact();
    }
  });

  /* new contact */

  $('button[name=add_contact]').click(function()
   {
     new_contact = $('input[name=new_contact]').val();
     $('input[name=new_contact]').val('');

     if (new_contact != '' && new_contact != pseudo && $('.contact[pseudo=' + new_contact + ']').length == 0)
     {
       write_contact({sender: new_contact, receiver: new_contact});
       $('.contact[pseudo=' + new_contact + ']').click();

       $.ajax({
         url: url + 'send',
         method: 'POST',
         data: {
           sender: pseudo,
           receiver: new_contact,
           text: 'Hi !'
         },
         success: function()
         {
           $('.message-container').empty();
           write_message(pseudo, 'Hi !');
         }
       });
     }
   });

  /* send */
  $('button[name=send]').click(send_message);

  $(document).keypress(function(e)
  {

    if (e.keyCode == 13 && $('textarea:focus').length)
    {
      e.preventDefault();
      send_message();
    }

  });

  setInterval(get_new_message, 1000);
  setInterval(get_notif, 1000);

  function send_message()
  {
    var message = {
      sender: pseudo,
      receiver: contact_select,
      text: $('textarea').val()
    };

    var re = /^[ \n\r]*$/;
    if (re.exec($('textarea').val()) == null && contact_select !== null)
    {
      write_message(null, message.text);

      $.ajax({
        url: url + 'send',
        method: 'POST',
        data: message
      });
    }
    $('textarea').val('').empty();
  }

  /* write message */
  function write_message(name, text)
  {
    if (name == pseudo || name == null)
      $('#message-container').append('<div class="message text-right bg-lightgray"><p>' + text + '</p></div>');
    else {
      $('#message-container').append('<div class="message"><h5>' + name +' :</h5><p>' + text + '</p></div>');
    }

    $('#message-container').scrollTop($('#message-container').prop("scrollHeight"));
  }


  /* get new message */

  function get_new_message()
  {
    $.ajax({
      url: url + 'new',
      method: 'POST',
      dataType: 'json',
      data: {receiver: pseudo, sender: contact_select},
      success: function(messages)
      {
        messages.forEach(function(message)
        {
          write_message(message.sender, message.text);
        });
      }
    });
  }

  /* get notif */

  function get_notif()
  {
    $.ajax({
      url: url + 'notif',
      method: 'POST',
      dataType: 'json',
      data: {receiver: pseudo},
      success: function(notifs)
      {
        notifs.forEach(function(notif)
        {
          if ($('.contact[pseudo=' + notif.sender + ']').length == 0)
            write_contact({sender: notif.sender, receiver: notif.sender});

          if (!$('.contact[pseudo=' + notif.sender + ']').hasClass('notif') && notif.sender != contact_select)
            $('.contact[pseudo=' + notif.sender + ']').addClass('notif');
        });
      }
    });
  }

  /* get last message */

  function get_last_message()
  {
    $.ajax({
      url: url + 'last',
      method: 'POST',
      dataType: 'json',
      data: {pseudo: pseudo, contact_name: contact_select},
      success: function(messages)
      {
        messages.reverse();
        messages.forEach(function(message)
        {
          write_message(message.sender, message.text);
        });
      }
    });
  }

  function write_contact(contact)
  {
    var contact_name = (contact.sender == pseudo ? contact.receiver : contact.sender);
    if ($('.contact[pseudo=' + contact_name + ']').length == 0)
    {
      var new_contact = $('#contact').append('<li class="contact" pseudo="' + contact_name + '"><h4>' + contact_name + '</h4></li>');
      $('.contact[pseudo=' + contact_name + ']').click(function(e)
      {
        new_contact_select = $(e.currentTarget).attr('pseudo');
        if (contact_select != new_contact_select)
        {
          if (contact_select)
            $('.contact[pseudo='+ contact_select +']').removeClass('active-contact');
          contact_select = new_contact_select;

          $(e.currentTarget).addClass('active-contact');

          if ($(e.currentTarget).hasClass('notif'))
            $(e.currentTarget).removeClass('notif');

          $('#message-container').empty();
          get_last_message();
        }
      });
    }
  }

  /* get contact */

  function get_contact()
  {
    $.ajax({
      url: url + 'contact',
      method: 'POST',
      dataType: 'json',
      data: {pseudo: pseudo, contact_name: contact_select},
      success: function(contacts)
      {
        contacts.forEach(function(contact)
        {
          write_contact(contact);
          contact_select = $('.contact:first-child').attr('pseudo');
          $('.contact:first-child').addClass('active-contact');
        });

        get_last_message();
      }
    });
  }

});
