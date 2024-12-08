<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Commande</title>
  <style>
    header {
      background-color:rgba(255,255,255,.5);
    }
    .carousel-item {
      height:100px;
    }
    .carousel-item img {
      height:100px;
    }
  </style>
</head>

<body> 
    <?php 
    include "data.php";
    $catalogue =getCatalogue();
    ?>
<div class="container-fluid m-1 ">
<div class="row">
  <nav class="col-sm-3">
    <h2 class="text-center">Rayons</h2>
    <ul>
    <li><a href="#portables">PC portables</a></li>
    <li><a href="#tablettes">Tablettes</a></li>
    </ul>
        <?php 
            foreach($catalogue as $rayon => $valeur) {
                echo "<li><a href='$rayon'>$rayon</a></li>";
            }
        ?>
    </ul>
    <button type="submit" name="commander" class="btn btn-primary m-3">
      Commander !
    </button>
  </nav>
  <div class="col-sm-9">
    <h2 class="text-center">Saisissez vos quantités d'articles puis Commandez !</h2>
        <?php
            foreach($catalogue as $rayon => $val) {
                echo "<div class=\n"
            }

  </div>
</div>
<div class="row">
  <div class="col text-center">
    <button type="submit" name="commander" class="btn btn-primary">Commander !</button>
  </div>
</div>

</form>
</div>
<script> $('.carousel').carousel({ interval: 1500 })
</script>
</body>
</html>