<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" /> <title> Liste des étudiants </title> </head>

<body>
<?php
  ini_set('display_errors', 1); error_reporting(E_ALL);
  $login = ""; $password = "";
  try {
     $dbh = new PDO('mysql:host=mysql.etu.umontpellier.fr;dbname='.$login.';charset=UTF8', $login, $password);
   } catch (PDOException $e) {
     die("Base de Données inaccessible : " . $e->getMessage() . "<br/>");
     // ou plutôt on redirige sur une autre page
     // header("Location: ./erreur.php?msg=Base de Données inaccessible !");
  } 

  $data = $dbh->query("SELECT nom FROM etudiant;");
  echo "<ul>";
  foreach ($data as $enregistrement){
      echo "<li>".$enregistrement['nom']."</li>";
  }
  echo "</ul>";    
?>
</body>
</html>
