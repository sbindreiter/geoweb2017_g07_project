<html>
<head>
    <title>geoweb.m10 - Gruppe 7 Projekt Laerm</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" type="text/css" href="../../g7default.css">
</head>

<body onscroll="navbars2Top()">

<div class="header">
</div>

<div id="navbar">
  <a href="https://student.ifip.tuwien.ac.at/geoweb/2017/g07/start_content_grp.htm">Welcome</a>
  <a href="https://student.ifip.tuwien.ac.at/geoweb/2017/g07/mitarbeiter.htm">Team</a>
  <a class "active" href="https://student.ifip.tuwien.ac.at/geoweb/2017/g07/projektbeschreibung.htm">Projekt</a>
  <a href="https://student.ifip.tuwien.ac.at/geoweb/2017/g07/intranet/feedback.php">Feedback</a>
  <a class="intranet" href="https://student.ifip.tuwien.ac.at/geoweb/2017/g07/intranet/start_intranet.htm">Intranet</a>
</div>

<div class="content">

<?php

// Datenbank Öffnen, Tabellenfunktion (einmalig) einbinden
include_once 'geoweb_pg_open.php';
include_once 'geoweb_pg_table_function.php';

// Abfrage festlegen (Bundesländer)
$Sql = 'SELECT g7_li_laermcat as Art, case when g7_li_privcat = 1 then 'oeffentlich' when g7_li_privcat = 2 then 'halboeffentlich' else 'privat' end as Privat, g7_li_name as Name, g7_li_email as Email, g7_li_msg as Beschreibung, ST_AsText(g7_li_geom) As Geometrie FROM g07.g7_laerminfo order by g7_li_id desc';

// Abfrage durchfÃ¼hren
$result = pg_query($db, $Sql)
          or die ('Fehler bei Abfrage: '.pg_last_error($db));

// Abfrage anzeigen
echo 'Abfrage: '.$Sql.'<br /><br />Ergebnis:'."\n";

// Abfrageergebnis als Tabelle ausgeben
geoweb_pg_table($result);

// Datenbank schlieÃŸen
include 'geoweb_pg_close.php';

?> 

</div>

<div class="footer">
<p> Copyright &copy; 2017 <a href="https://student.ifip.tuwien.ac.at/geoweb/2017/g07/impressum.htm" target="self">geowebgruppe7</a></p>
</div>

</body>

<script>
var navbar = document.getElementById("navbar");
var navbarsub = document.getElementById("navbarsub");
var sticky = navbar.offsetTop;

function navbars2Top() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
    navbarsub.classList.add("sticky_nav2");
  } else {
    navbar.classList.remove("sticky");
    navbarsub.classList.remove("sticky_nav2");
  }
}
</script>

</html>