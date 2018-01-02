<?php
# Connect to PostgreSQL database
include '../php/geoweb_pg_open.php';


$whereClause = "where 1=1";
//  if($_POST && isset($_POST['pos']))
if(TRIM($_REQUEST['type']) == "L" || TRIM($_REQUEST['type']) == "R")
{
  $whereClause = " where g7_li_laermcat = '" . TRIM($_REQUEST['type']) ."'";
}
//echo $whereClause;
# Build SQL SELECT statement and return the geometry as a GeoJSON element
//$sql = 'SELECT *, public.ST_AsGeoJSON(g7_li_geom,6) AS geojson FROM g07.g7_laerminfo ' . $whereClause;
//echo $sql;
//exit;
$sql = "SELECT g7_li_id as ID, g7_li_place as Ort, g7_li_desc as Beschreibung, ";
$sql .= " CASE WHEN g7_li_laermcat = 'L' THEN 'Lärmort' WHEN g7_li_laermcat = 'R' THEN 'Ruheoase' ELSE 'Unknown' END AS Typ, ";
$sql .= " CASE WHEN g7_li_privcat = 1 THEN 'öffentlich' WHEN g7_li_privcat = 2 THEN 'halböffentlich' ELSE 'privat' END AS Zugang, ";
$sql .= " g7_li_name as von, ";
$sql .= " public.ST_AsGeoJSON(g7_li_geom,6) AS geojson FROM g07.g7_laerminfo " . $whereClause;

# Try query or error
$result = pg_query($sql);
if (!$result) {
  echo "An SQL error occured.\n";
  exit;
}
# Build GeoJSON feature collection array
$geojson = array(
  'type' => 'FeatureCollection',
  'features' => array()
);
# Loop through rows to build feature arrays
while ($row = pg_fetch_assoc($result)) {
  $properties = $row;
  # Remove geojson and geometry fields from properties
  unset($properties['geojson']);
  unset($properties['g7_li_geom']);
  $feature = array(
    'type' => 'Feature',
    'geometry' => json_decode($row['geojson'], true),
    'properties' => $properties
  );
  # Add feature arrays to feature collection array
  array_push($geojson['features'], $feature);
}
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json; charset=utf-8');
echo json_encode($geojson, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES |
    JSON_NUMERIC_CHECK);
include '../php/geoweb_pg_close.php';
?>
