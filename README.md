#ChatPHP

ChatPHP est un système de chat simple en PHP + Ajax.

###A faire :
[ ] Groupe de Chat

###Installation :

> - Activer mod_rewrite Apache2 :
```
	sudo a2enmod rewrite
	sudo service apache2 restart
```

> - Importer la BDD :
```
	Fichier 'chatdb.sql'
```
> - Paramétrer la BDD :
```
	Fichier 'Core/Database.php'
  	$host     = 'localhost';
  	$port     = 3306;
  	$dbname   = 'chatphp';
  	$username = 'root';
  	$password = '';
```
