<?php
use PHPUnit\Framework\TestCase;

if (!defined("ROOT_DIR")) { define("ROOT_DIR", __DIR__ . "/../.."); }
require_once(__DIR__ . "/../../helpers/db.php");

class DbTest extends TestCase {

  public function testGetDbNameValidNames(): void {
    $testDbName = "testDbName";
    $defaultDSNs = [
      "mysql:host=db.example.com;port=3306;dbname=$testDbName",
      "mysql:host=db.example.com;dbname=$testDbName;port=3306",
      "mysql:dbname=$testDbName;host=db.example.com;port=3306",
      "mysql:unix_socket=/tmp/mysql.sock;dbname=$testDbName;charset=utf8",
      "pgsql:host=localhost;port=5432;dbname=$testDbName;user=myuser;password=mypass",
      "pgsql:host=db.example.com port=31075 dbname=$testDbName",
      "pgsql:host=db.example.com port=31075 dbname=$testDbName user=myuser password=mypass",
      "sqlite:$testDbName",
      "sqlite2:$testDbName",
      "sqlite3:$testDbName"
    ];

    foreach ($defaultDSNs as $dsn) {
      self::assertEquals($testDbName, uDb::getDbName($dsn));
    }
  }

  public function testGetDbNameEmptyNames(): void {
    $testDbName = "";
    $defaultDSNs = [
      "mysql:host=db.example.com;port=3306;dbname=",
      "mysql:host=db.example.com;port=3306",
      "",
      null,
      "unsupported:host=localhost;port=5432;dbname=;user=test;password=mypass",
      "corrupt",
      "pgsql:",
      "sqlite",
      "sqlite3",
      "sqlite:"
    ];

    foreach ($defaultDSNs as $dsn) {
      self::assertEquals($testDbName, uDb::getDbName($dsn));
    }

  }

  public function testGetDbFilename(): void {
    $testFileNames = [
      "C:\\Program Files\\Database.db",
      ":memory:",
      "/tmp/testdb.db3"
    ];

    foreach ($testFileNames as $fileName) {
      self::assertEquals($fileName, uDb::getDbName("sqlite:$fileName"));
    }
  }

  public function testNormalizeDsn(): void {
    $testDbName = "testDbName";
    $nonSqlite = [
      "mysql:host=db.example.com;port=3306;dbname=$testDbName",
      "mysql:host=db.example.com;dbname=$testDbName;port=3306",
      "mysql:dbname=$testDbName;host=db.example.com;port=3306",
      "mysql:unix_socket=/tmp/mysql.sock;dbname=$testDbName;charset=utf8",
      "pgsql:host=localhost;port=5432;dbname=$testDbName;user=myuser;password=mypass",
      "pgsql:host=db.example.com port=31075 dbname=$testDbName",
      "pgsql:host=db.example.com port=31075 dbname=$testDbName user=myuser password=mypass",
    ];

    foreach ($nonSqlite as $dsn) {
      self::assertEquals($dsn, uDb::normalizeDsn($dsn));
    }

    self::assertEquals("sqlite:" . realpath(ROOT_DIR . "/index.php"), uDb::normalizeDsn("sqlite:index.php"));
    self::assertEquals("sqlite:" . realpath(ROOT_DIR . "/index.php"), uDb::normalizeDsn("sqlite:helpers/../index.php"));
    self::assertNotEquals("sqlite:" . realpath(ROOT_DIR . "/index.php"), uDb::normalizeDsn("sqlite:../index.php"));
  }
}

?>