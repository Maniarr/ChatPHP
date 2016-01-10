<?php

require_once('Core'.DIRECTORY_SEPARATOR.'config.php');
require_once('Core'.DIRECTORY_SEPARATOR.'autoload.php');

use Core\Config\Autoload;

Autoload::load($load);

$router = new Router();

$router->get('/', 'PageController::index');

$router->post('/new', 'MessageController::get_new_message');
$router->post('/send', 'MessageController::send_message');
$router->post('/last', 'MessageController::get_last_message');
$router->post('/contact', 'MessageController::get_contact');
$router->post('/notif', 'MessageController::get_notification');

$router->add_404('PageController::route_404');

$router->run();
