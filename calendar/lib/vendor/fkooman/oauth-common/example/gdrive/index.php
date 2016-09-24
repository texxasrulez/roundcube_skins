<?php

use fkooman\OAuth\Client\Api;
use fkooman\OAuth\Client\Context;
use fkooman\OAuth\Client\GoogleClientConfig;
use fkooman\OAuth\Client\SessionStorage;
use fkooman\OAuth\Client\PdoStorage;
use fkooman\OAuth\Client\Guzzle3Client;
use Guzzle\Http\Client;
use Guzzle\Http\Exception\ClientErrorResponseException;

require_once 'vendor/autoload.php';

try {
    /* OAuth client configuration */
    $clientConfig = new GoogleClientConfig(json_decode(file_get_contents('client_secrets.json'), true));

    //$db = new PDO(sprintf("sqlite:%s/data/client.sqlite", __DIR__));
    //$tokenStorage = new PdoStorage($db);
    $tokenStorage = new SessionStorage();

    $api = new Api('php-drive-client', $clientConfig, $tokenStorage, new Guzzle3Client());
    $context = new Context('john.doe@example.org', array('https://www.googleapis.com/auth/drive.readonly'));

    /* the protected endpoint uri */
    $apiUri = 'https://www.googleapis.com/drive/v2/files';

    /* get the access token */
    $accessToken = $api->getAccessToken($context);
    if (false === $accessToken) {
        /* no valid access token available just yet, go to authorization server */
        header('HTTP/1.1 302 Found');
        header('Location: '.$api->getAuthorizeUri($context));
        exit;
    }

    /* we have an access token */
    try {
        $client = new Client();
        $request = $client->post($url);
        $request->addHeader('Authorization', sprintf('Bearer %s', $accessToken->getAccessToken()));

        $response = $request->send();
        header('Content-Type: application/json');
        echo $response->getBody();
    } catch (ClientErrorResponseException $e) {
        if (401 === $e->getResponse()->getStatusCode()) {
            /* no valid access token available just yet, go to authorization server */
            $api->deleteAccessToken($context);
            header('HTTP/1.1 302 Found');
            header('Location: '.$api->getAuthorizeUri($context));
            exit;
        }
        throw $e;
    }
} catch (Exception $e) {
    echo sprintf('ERROR: %s', $e->getMessage());
}
