<?php
    require_once("connection.php");

	function login($username, $password) {
		$username = $username;
        $password = $password;
        $sql = "SELECT `username`, `password` FROM `users` WHERE `username` = '$username'";
        global $connection;
		$login = mysqli_query($connection, $sql);
		if(mysqli_num_rows($login) == 1)
			while($row = mysqli_fetch_array($login))
				if(password_verify($password, $row['password']) )
					return true;
		return false;
	}
	function details($username, $password) {
		if(login($username, $password)) {
            global $connection;
			$sql = "SELECT * FROM `users` WHERE `username` = '$username'";
			$res = mysqli_query($connection, $sql);
			$players  = mysqli_fetch_array($res);
			return $players;
		} else
			return null;
	}
?>