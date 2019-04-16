<?php
class DB {
    // consider redesigning
    private static $connection;
    public static function connect() {
        if(!isset(self::$connection)) {
            self::$connection = new mysqli('localhost', 'root', '', 'twinkle');
            self::$connection->set_charset("utf8");
        }
    }

    public static function query($query) {
        return self::$connection->query($query);
    }
    
    public static function queryScalar($query) {
        return self::$connection->query($query)->fetch_array()[0];
    }

    public static function userExists($username, $password) {
        $res = self::query("SELECT `username`, `password` FROM `users` WHERE `username` = '$username'")->fetch_assoc();
        return !($res === NULL || !password_verify($password, $res['password']));
    }

    public static function loggedIn() {
        return (isset($_SESSION['username']) && isset($_SESSION['password']));
    }

    public static function error() {
        return self::$connection->error;
    }

    public static function insertId() {
        return self::$connection->insert_id;
    }

    public static function isLoggedIn() {
        if(isset($_COOKIE['SNID'])) {
            $res = self::query("select userid from loginTokens where token='".sha1($_COOKIE['SNID'])."'");
            if($res->num_rows !== 0) {
                $userid = $res->fetch_array()[0];
                if(!isset($_COOKIE['SNID_'])) { // it has been 3 to 7 days since user logged in
                    $token = bin2hex(openssl_random_pseudo_bytes(64, $cstrong));
                    DB::query("insert into loginTokens (token, userid) values ('".sha1($token)."', ".$userid.")");
                    DB::query("delete from loginTokens where token='".sha1($_COOKIE['SNID'])."'");
                    setcookie("SNID", $token, time() + 60 * 60 * 24 * 7, '/', NULL, NULL,  TRUE);
                    setcookie("SNID_", '1', time() + 60 * 60 * 24 * 3, '/', NULL, NULL,  TRUE);
                }
                if(self::queryScalar("select count(*) from loginTokens where userid=".$userid) > 5) // max 5 devices allowed logged in at any given time
                    DB::query("delete from loginTokens where userid=".$userid." limit 1"); // logout of 1 device
                return $userid;
            }
        }
        return false;
    }
}
?>