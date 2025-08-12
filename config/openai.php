<?php

return [

    /*
    |--------------------------------------------------------------------------
    | OpenAI Configuration
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials and configuration for OpenAI API.
    | The API key should be set in your .env file for security.
    |
    */

    'api_key' => env('OPENAI_API_KEY'),

    'base_url' => env('OPENAI_BASE_URL', 'https://api.openai.com/v1'),

    'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),

    'timeout' => env('OPENAI_TIMEOUT', 60),
    
    'connect_timeout' => env('OPENAI_CONNECT_TIMEOUT', 30),
    
    'read_timeout' => env('OPENAI_READ_TIMEOUT', 180),

    'max_tokens' => env('OPENAI_MAX_TOKENS', 4000),

    'temperature' => env('OPENAI_TEMPERATURE', 0.7),

];
