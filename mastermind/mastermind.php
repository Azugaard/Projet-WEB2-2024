<?php
interface iMastermind {
  public function __construct($taille=4);
  public function test($code);
  public function getEssais();
  public function getTaille();
}

class Mastermind implements iMastermind {
    public $code;
    protected $taille;
    protected $tentative=array();

    function __construct($taille){
        $this->code="";
        for($i=0;$i<$taille;$i++){
            $code.=(string)rand(0,9);
        }
        echo this->code;
    }
    public function test($code){
        $juste=0;
        $malP=0;
        $taillecode=strlen($this->code);

        for($i=0;$i<taillecode;$i++){
            if($this->code[$i]==$tentative[$i]){
                $juste++;
            } else {
                for($t=0;$t<taillecode;$t++){
                    if($this->code[$t]==$tentative[$t]){
                        $malP++;
                    }
                }
            }
        }
        
    }
    public function getEssais(){

    }
    public function getTaille(){

    }
}
?>
