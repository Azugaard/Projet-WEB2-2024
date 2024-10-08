
      function creeHexagone(rayon) {
        var points = new Array();
        for (var i = 0; i < 6; ++i) {
            var angle = i * Math.PI / 3;
            var x = Math.sin(angle) * rayon;
            var y = -Math.cos(angle) * rayon;
	         console.log("x="+Math.round(x*100)/100+" y="+Math.round(y*100)/100);
            points.push([Math.round(x*100)/100, Math.round(y*100)/100]);
        }
        return points;
     }
 
      function genereDamier(rayon, nbLignes, nbColonnes) {

      distance =  rayon - (Math.sin(1 * Math.PI / 3) * rayon);  // plus grande distance entre l'hexagone et le cercle circonscrit

      d3.select("#tablier").append("svg").attr("width", nbColonnes*(rayon*2+distance)).attr("height", nbLignes*(rayon+distance*2));
      var hexagone = creeHexagone(rayon);
      for (var ligne=0; ligne < nbLignes; ligne++) {
         for (var colonne=0; colonne < nbColonnes; colonne++) {
               var d = "";
               var x, y;
               for (h in hexagone) {
                  x = hexagone[h][0]+(rayon-distance)*(2+2*colonne);
                  y = distance*2 + hexagone[h][1]+(rayon-distance*2)*(1+2*ligne);
                  let angle=1*Math.PI/3;
                  x+=ligne*(Math.sin(angle)*rayon);
                  if(h==0){
                     d="M"+x+" "+y;
                  } else {
                     d+=" L"+x+" "+y;
                  }
               }
               d +=" Z";
               console.log(d);
               d3.select("svg")
                  .append("path")
                  .attr("d", d)
                  .attr("stroke-width",1) // car un id doit commencer par une lettre
                  .attr("stroke","white")
                  .attr("id","h"+(ligne*nbLignes+colonne))
                  .on("click", function(d) {
                     console.log(d3.select(this).attr('id'));
                     d3.select(this).attr('fill', 'red');
               });
            }
       }
    }

