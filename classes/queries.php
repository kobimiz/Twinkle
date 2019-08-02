<?php
class DB {
    // consider redesigning
    private static $connection;
    
    /* Connects to a the server, and to the database. Done only once in the head of the file. */
    public static function connect() {
        if(!isset(self::$connection)) {
            self::$connection = new mysqli('localhost', 'root', '', 'twinkle');
            self::$connection->set_charset("utf8");
        }
    }

    /* Executes a query to the database, and returns the result if there is any as, mysqli_result object. https://www.php.net/manual/en/class.mysqli-result.php */
    public static function query($query) {
        return self::$connection->query($query);
    }
    
    /* For selection queries. Returns only the first result as string. */
    public static function queryScalar($query) {
        return self::$connection->query($query)->fetch_array()[0];
    }

    /* Checks if a there is a user with specific username and password. Returns true/false. */
    public static function userExists($username, $password) {
        $res = self::query("SELECT `username`, `password` FROM `users` WHERE `username` = '$username'")->fetch_assoc();
        return !($res === NULL || !password_verify($password, $res['password']));
    }

    /* Returns a string that describes the sql error that occured after a function call. */
    public static function error() {
        return self::$connection->error;
    }

    /* Returns the auto generated id used in the latest query. */
    public static function insertId() {
        return self::$connection->insert_id;
    }

    /* Checks if a user is logged in (via cookies). Returns true/false. */
    public static function isLoggedIn() {
        if(isset($_COOKIE['SNID'])) {
            $res = self::query("select userid from loginTokens where token='".sha1($_COOKIE['SNID'])."'");
            if($res->num_rows !== 0) {
                $userid = $res->fetch_array()[0];
                if(!isset($_COOKIE['SNID_'])) { // it has been 3 to 7 days since user logged in
                    $token = bin2hex(openssl_random_pseudo_bytes(64, $cstrong));
                    setcookie("SNID", $token, time() + 60 * 60 * 24 * 7, '/', NULL, NULL,  TRUE);
                    setcookie("SNID_", '1', time() + 60 * 60 * 24 * 3, '/', NULL, NULL,  TRUE);
                    DB::query("insert into loginTokens (token, userid) values ('".sha1($token)."', ".$userid.")");
                    DB::query("delete from loginTokens where token='".sha1($_COOKIE['SNID'])."'");
                }
                if(self::queryScalar("select count(*) from loginTokens where userid=".$userid) > 5) // max 5 devices allowed logged in at any given time
                    DB::query("delete from loginTokens where userid=".$userid." limit 1"); // logout of 1 device
                return $userid;
            }
        }
        return false;
    }

    /* Selects fields of current logged in user as mysqli_result. fields variable example: "id, username" */
    public static function getLoggedUserInfo($fields) {
        $userid = self::queryScalar("select userid from loginTokens where token='".sha1($_COOKIE['SNID'])."'");
        return self::query("select $fields from users where id=$userid")->fetch_assoc();
    }

    /* Returns the path for a profile pic with image name $picName */
    public static function profilePic($picName) {
        return ($picName === "") ? "/iconList/user.png":"/uploads/".$picName;
    }
}
?>