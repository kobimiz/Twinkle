<?php
    require_once("connection.php");

	function login($username, $password) {
		$username = $username;
        $password = $password;
        $sql = "SELECT `username`, `password` FROM `users` WHERE `username` = '$username'";
        global $connection;
		$login = mysqli_query($connection, $sql);
		if(mysqli_num_rows($login) == 1)
			while($row = mysqli_fetch_assoc($login))
				if(password_verify($password, $row['password']) )
					return true;
		return false;
	}
	function details($username) {
		global $connection;
		$sql = "SELECT * FROM `users` WHERE `username` = '$username'";
		$res = mysqli_query($connection, $sql);
		$players  = mysqli_fetch_assoc($res);
		return $players;
	}
	function isLoggedIn($additionalCondition = NULL) {
		if(isset($_SESSION['username']) && isset($_SESSION['password'])) {
			$username = $_SESSION['username'];
			$password = $_SESSION['password'];
			if(!login($username, $password))
				header("Location: signin.php");
			if($additionalCondition !== NULL)
				$additionalCondition();
		}
		else
			header("Location: signin.php");
	}
?>