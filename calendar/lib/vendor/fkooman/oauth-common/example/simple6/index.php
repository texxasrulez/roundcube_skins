<?php

require_once 'vendor/autoload.php';

use fkooman\OAuth\Client\Guzzle6Client;
use fkooman\OAuth\Client\ClientConfig;
use fkooman\OAuth\Client\SessionStorage;
use fkooman\OAuth\Client\Api;
use fkooman\OAuth\Client\Context;

$clientConfig = new ClientConfig(
    array(
        'authorize_endpoint' => 'http://localhost/php-oauth-as/authorize.php',
        'client_id' => 'php-oauth-client-example6',
        'client_secret' => 'f00b4r',
        'token_endpoint' => 'http://localhost/php-oauth-as/token.php',
    )
);

$tokenStorage = new SessionStorage();
$httpClient = new Guzzle6Client();
$api = new Api('foo', $clientConfig, $tokenStorage, $httpClient);

$context = new Context('john.doe@example.org', array('authorizations'));

$accessToken = $api->getAccessToken($context);
if (false === $accessToken) {
    /* no valid access token available, go to authorization server */
    header('HTTP/1.1 302 Found');
    header('Location: '.$api->getAuthorizeUri($context));
    exit;
}

echo 'Access Token: '.$accessToken->getAccessToken();
