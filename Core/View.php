<?php

class View
{
  public $path;

  function View($name)
  {
      $this->path = BASE_PATH.'View'.DIRECTORY_SEPARATOR.$name.'.php';
  }

  function render($data = array())
  {
    echo $this->fetch($data);
  }

  function fetch($data_get_router_with_method_to_methods_fetch_of_object_view = null)
  {
    if ($data_get_router_with_method_to_methods_fetch_of_object_view != null)
        extract($data_get_router_with_method_to_methods_fetch_of_object_view);
    ob_start();
        require($this->path);
    return ob_get_clean();
  }

  function url($url) {
    echo URL.''.$url;
  }

  function asset($url) {
    echo URL.'public/'.$url;
  }
}
