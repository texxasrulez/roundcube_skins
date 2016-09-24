<?php

require_once 'vendor/autoload.php';

use fkooman\OAuth\Client\Guzzle6Client;
use fkooman\OAuth\Client\ClientConfig;
use fkooman\OAuth\Client\SessionStorage;
use fkooman\OAuth\Client\Callback;

$clientConfig = new ClientConfig(
    array(
        'authorize_endpoint' => 'http://localhost/php-oauth-as/authorize.php',
        'client_id' => 'php-oauth-client-example6',
        'client_secret' => 'f00b4r',
        'token_endpoint' => 'http://localhost/php-oauth-as/token.php',
    )
);

try {
    $tokenStorage = new SessionStorage();
    $httpClient = new Guzzle6Client();

    $cb = new Callback('foo', $clientConfig, $tokenStorage, $httpClient);
    $cb->handleCallback($_GET);

    header('HTTP/1.1 302 Found');
    header('Location: http://localhost/fkooman/php-oauth-client/example/simple6/index.php');
    exit;
} catch (fkooman\OAuth\Client\Exception\AuthorizeException $e) {
    // this exception is thrown by Callback when the OAuth server returns a
    // specific error message for the client, e.g.: the user did not authorize
    // the request
    die(sprintf('ERROR: %s, DESCRIPTION: %s', $e->getMessage(), $e->getDescription()));
} catch (Exception $e) {
    // other error, these should never occur in the normal flow
    die(sprintf('ERROR: %s', $e->getMessage()));
}
