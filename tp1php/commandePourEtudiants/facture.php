<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
    <table border="1">
        <tr><th>Quantité</th><th>Article</th><th>Prix Unitaire HT</th>
        <th>TVA</th><th>TTC</th></tr>
        <?php
        include"data.php";
            foreach ($_GET as $portable => $valeur){
                if (!empty($_GET[$portable])){
                    $data= getArticle(getCatalogue(),$portable);
                    $prix=$data['prix'];
                    echo "<tr><td>$valeur</td><td>$parametre</td><td>
                    $prix</td><td></td><td></td><tr>";
                }
            }
        ?>
        <tr><th></th><th>TOTAL</th><th></th><th></th><th></th><tr>
            <div>
</body>
</html>