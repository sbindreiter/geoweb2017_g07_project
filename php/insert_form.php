
<html>
<body>
<form method="POST" action="insert_point.php">

  <fieldset>
    <input type="radio" id="laerm1" name="laerm" value="R" checked>
    <label for="laerm1">Ruheoase</label>
    <input type="radio" id="laerm2" name="laerm" value="L">
    <label for="laerm2">Lärmzone</label>
  </fieldset>

  <fieldset>
    <input type="radio" id="privacat1" name="privcat" value="1" checked>
    <label for="privacat1">öffentlich</label>
    <input type="radio" id="privacat2" name="privcat" value="2">
    <label for="privacat2">halböffentlich</label>
    <input type="radio" id="privacat3" name="privcat" value="3">
    <label for="privacat3">privat</label>
  </fieldset>

    <input type="text" name="name" size="50"><br>
    <input type="text" name="email" size="50"><br>
    <input type="text" name="message" size="50"><br>
  
  <input type="submit" value="send">
  <input type="reset" value="cancel">
  <input type="hidden" name="pos" value="<?php echo $_GET['pos'];?> ">
</form>
</body>
</html>

