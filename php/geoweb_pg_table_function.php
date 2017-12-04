<?php
// Funktion: Abfrageergebnis in Html-Tabelle ausgeben

Function geoweb_pg_table($result)
{
  echo 'TableFunction';    
  // Tabellen-Header (Feldnamen)
  echo 
  '<table border="1" style="border-collapse:collapse;" cellpadding="3">';
  echo "\n<tr>";
  for ($i=0; $i<pg_num_fields($result); $i++)
    {echo '<th  bgcolor="#CCFFFF">'.pg_field_name($result,$i).'</th>';} 
  echo "</tr>\n";
  
  // Alle Zeilen ausgeben
  while ($zeile = pg_fetch_assoc($result)) 
    {echo '<tr>';
     // Alle Spaltenwerte je Zeile ausgeben
     foreach ($zeile as $fld_val) 
       {if (is_numeric($fld_val))
          {echo '<td align="right">'.$fld_val.'</td>';}
        else
          {echo '<td>'.$fld_val.'</td>';}
       }
     echo "</tr>\n";
    }
  
  echo '</table>';
}
?> 