<html>
<body>
<?php
  $name = $_REQUEST['name'];  // $_REQUEST enthält die Benutzerangaben
  $email = $_REQUEST['email'];
  $message = $_REQUEST['message'] ;

  $laerm = $_REQUEST['laerm'];
  $priv = $_REQUEST['privcat'];
 
  //echo "debug0a,'". $name ."','". $email ."','". $message ."','".$laerm ."',".$priv;
  
  /*TESTDATEN - LOESCHEN, sobald sinnvolle Daten kommen*/
  if(TRIM($name) == "")
  {
    $name = "tname";
  }
  if(TRIM($email) == "")
  {
      $email = "temail@mymail.com";
  }
  if(TRIM($message) == "")
  {
      $message = "tmessage mit ein bisschen inhalt";
  }
  if(TRIM($laerm) == "")
  {
      $laerm = 'R';
      if(mt_rand(0,1)>0)
      {
          $laerm = 'L';
      }
  }
  if(TRIM($priv) == "")
  {
      $priv = mt_rand(1,3);
  }
  //echo "debug0b,'". $name ."','". $email ."','". $message ."','".$laerm ."',".$priv;  
  
  /*TESTDATEN ENDE*/

  include 'geoweb_pg_open.php'; // PostgreSQL-Datenbank öffnen
  //echo "debug0c";
  
  echo"<input type='hidden' name='pos' value='".$_GET['pos']."'>";
  //  if($_POST && isset($_POST['pos']))
  
  $pos = "0.0 0.0";
  //echo "debug1" . $pos;
  //$pos = $_GET['pos'];
  //echo "debug1a inhalt von pos>" .$pos ."< danach";
  $pointTxt = " ";

  if(TRIM($_GET['pos']) != "")
  {
    $pointTxt = "ST_GeomFromText('POINT(".$_GET['pos'].")')";
  }
  else
  {
    $pointTxt = "ST_GeomFromText('POINT(0.0 0.0)')";
  }  
  //echo $pointTxt;  
       
  // Daten in Tabelle feedback einfügen mit SQL-Befehl 
  // INSERT INTO <tabelle> (felder, ...) VALUES (werte, ...) 
  // Die Werte sind bei Textfelder in (einfache) Hochkomma zu setzen, 
  // bei Zahlen ohne Hochkomma (hier nur bei teamflag)
  // SQL-String zusammensetzen
  
  $sql = "INSERT INTO g07.g7_laerminfo (g7_li_name,g7_li_email,g7_li_msg,g7_li_date,g7_li_privcat,g7_li_laermcat, g7_li_geom)";
  
  //echo "debug3" . $sql;  
  
  $sql = $sql . " VALUES ('" . $name . "','" . $email . "','" . $message . "','"  . date("d-m-Y") .  "'," . $priv . ",'" . $laerm .
         "',".$pointTxt.")";
  
  //echo "debug4" . $sql;  
  
  // SQL-String an Datenbank-Server schicken (Beispiel SQLite-Datenbank: 
  $res=pg_query($db,$sql) or die ('Fehler bei Speichern! Das Feedback Formular wurde leider nicht korrekt uebermittelt! Entschuldigen Sie die Unanehmlichkeiten!'.pg_last_error($db)); 
  //echo "debug5";
  include 'geoweb_pg_close.php'; // Datenbank schließen

 
  //echo "<h2>Danke für Ihren Eintrag!</h2><p>Die Daten wurden in der Datenbank gespeichert!</p>";
/* Alternativ: Aufruf einer Html-Seite für Danksagung */ 
/* header( "Location: http://xxx.yyy/feedback_thank.htm" );exit; */
   header( "Location: http://localhost:3000" );exit;
?> 
</body>
</html>