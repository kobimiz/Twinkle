<?php
    class DB {
        private static $connection;
        public static function connect() {
            self::$connection = new mysqli('localhost', 'root', '', 'twinkle');
            self::$connection->set_charset("utf8");
        }

        public static function query($query) {
            return self::$connection->query($query);
        }

        public static function userExists($username, $password) {
            $res = self::query("SELECT `username`, `password` FROM `users` WHERE `username` = '$username'");
            return !($res === NULL || !password_verify($password, $res->fetch_assoc()['password']));
        }

        public static function loggedIn() {
            return (isset($_SESSION['username']) && isset($_SESSION['password']));
        }
    }
?>