<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Milestone Not Found</title>
    </head>
    <body>
        <div style="margin:auto">
            <h1>Not Found</h1>
            <br/>
            <span>{{ isset($message) ? $message : "" }}</span>
        </div>
    </body>
</html>
