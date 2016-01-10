<?php

class MessageController extends Controller
{
  function send_message()
  {
      $req = $this->db->prepare('INSERT INTO message(sender, receiver, text) VALUE (:sender, :receiver, :text)');
      $req->execute(array(':sender' => htmlspecialchars($_POST['sender']),
                          ':receiver' => htmlspecialchars($_POST['receiver']),
                          ':text' => htmlspecialchars($_POST['text'])));
  }

  function	get_new_message()
  {
    $req = $this->db->prepare('SELECT id, sender, text FROM message WHERE receiver = :receiver AND sender = :sender AND show_at IS NULL ORDER BY created_at ASC');
    $req->execute(array(':receiver' => htmlspecialchars($_POST['receiver']), ':sender' => htmlspecialchars($_POST['sender'])));

    $messages = $req->fetchAll();

    foreach ($messages as $message)
    {
      $req = $this->db->prepare('UPDATE message SET show_at = CURRENT_TIMESTAMP WHERE id = :id');
      $req->execute(array(':id' => $message['id']));
    }

    echo json_encode($messages);
  }

  function	get_last_message()
  {
    $req = $this->db->prepare('SELECT id,  sender, text FROM message WHERE receiver = :pseudo AND sender = :contact_name AND show_at IS NULL ORDER BY created_at');
    $req->execute(array(':pseudo' => htmlspecialchars($_POST['pseudo']),
                        ':contact_name' => htmlspecialchars($_POST['contact_name'])));

    $new_messages = $req->fetchAll();

    foreach ($new_messages as $message)
    {
      $req = $this->db->prepare('UPDATE message SET show_at = CURRENT_TIMESTAMP WHERE id = :id');
      $req->execute(array(':id' => $message['id']));
    }

    $req = $this->db->prepare('SELECT sender, text FROM message WHERE receiver = :pseudo AND sender = :contact_name OR sender = :pseudo AND receiver = :contact_name ORDER BY created_at DESC LIMIT 10');
    $req->execute(array(':pseudo' => htmlspecialchars($_POST['pseudo']),
                        ':contact_name' => htmlspecialchars($_POST['contact_name'])));

    $messages = $req->fetchAll();

    echo json_encode($messages);
  }

  function get_contact()
  {
    $req = $this->db->prepare('SELECT DISTINCT sender, receiver FROM `message` WHERE receiver = :pseudo OR sender = :pseudo ORDER BY created_at DESC');
    $req->execute(array(':pseudo' => htmlspecialchars($_POST['pseudo'])));

    $messages = $req->fetchAll();

    echo json_encode($messages);
  }

  function get_notification()
  {
    $req = $this->db->prepare('SELECT sender FROM message WHERE receiver = :receiver AND show_at IS NULL ORDER BY created_at ASC');
    $req->execute(array(':receiver' => htmlspecialchars($_POST['receiver'])));

    $messages = $req->fetchAll();

    echo json_encode($messages);
  }
}
