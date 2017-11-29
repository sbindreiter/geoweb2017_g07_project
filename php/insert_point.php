<?php
  $name = $_REQUEST['name'];  // $_REQUEST enthält die Benutzerangaben
  $email = $_REQUEST['email'];
  $message = $_REQUEST['message'] ;

  if (isset($_REQUEST['geschlecht'])) 
     {
     $sex = S_REQUEST['geschlecht'];
     if($sex = 'm')
         $anrede = "Herr";
     else
         $anrede = "Frau";
     } // Frau/Herr
  else 
     {
     $anrede=" ";
     }
     
  if (isset($_REQUEST['team'])) 
     {$team="geoweb-Mitglied";
      $teamflag=1;} 
  else 
     {$team="geoweb-extern";
      $teamflag=0;}
 
  include 'geoweb_pg_open.php'; // PostgreSQL-Datenbank öffnen

  $pos = " 0 , 0 ";
  if(isset($_POST['pos']))
    {
    $pos = $_POST['pos']);
    }
      
  
  // Daten in Tabelle feedback einfügen mit SQL-Befehl 
  // INSERT INTO <tabelle> (felder, ...) VALUES (werte, ...) 
  // Die Werte sind bei Textfelder in (einfache) Hochkomma zu setzen, 
  // bei Zahlen ohne Hochkomma (hier nur bei teamflag)
  // SQL-String zusammensetzen
  $sql = "INSERT INTO g07.g7_laerminfo (g7_li_name,g7_li_email,g7_li_msg,g7_li_date,g7_li_privcat,g7_li_laermcat, g7_li_geom)";
  $sql = $sql . " VALUES ('" . $name . "','" . $email . "','" . $message . "',"  . date("d-m-Y") .  "','" . $priv . "','" . $laerm .
         "',ST_GeomFromText('POINT(" . $pos . ")'))";
              
  // SQL-String an Datenbank-Server schicken (Beispiel SQLite-Datenbank: 
  $res=pg_query($db,$sql) or die ('Fehler bei Speichern! Das Feedback Formular wurde leider nicht korrekt uebermittelt! Entschuldigen Sie die Unanehmlichkeiten!'.pg_last_error($db));
  
  include 'geoweb_pg_close.php'; // Datenbank schließen

  echo "<h2>Danke für Ihren Eintrag!</h2><p>Die Daten wurden in der Datenbank gespeichert!</p>";
/* Alternativ: Aufruf einer Html-Seite für Danksagung */ 
/* header( "Location: http://xxx.yyy/feedback_thank.htm" );exit; */
?> 
