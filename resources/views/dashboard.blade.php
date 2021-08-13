<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <title>Dashboard</title>
  <!-- JQUERY -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <!-- FONT AWESOME -->
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet"
    type="text/css">
  <!-- BOOTSTRAP and UNIFORM -->
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" type="text/javascript"></script>
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet"
    type="text/css">

  <!-- LAMBENT CSS -->
  <link href="{{ asset('css/comment.css') }}" rel="stylesheet" type="text/css">
  <link href="{{ asset('css/components.css') }}" rel="stylesheet" type="text/css">
  <link href="{{ asset('css/datepicker.css') }}" rel="stylesheet" type="text/css">
  <link href="{{ asset('css/goal.css') }}" rel="stylesheet" type="text/css">
  <link href="{{ asset('css/lambent.css') }}" rel="stylesheet" type="text/css">
  <link href="{{ asset('css/link.css') }}" rel="stylesheet" type="text/css">
  <link href="{{ asset('css/milestone.css') }}" rel="stylesheet" type="text/css">
  <link href="{{ asset('css/responsive-forms.css') }}" rel="stylesheet" type="text/css">

  <!-- FONTS -->
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <!-- Pacifico for vision/purpose/obstacle headers -->
  <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">

  <meta name="viewport" content="width=device-width, initial-scale=1.0" charset="UTF-8">
</head>

<body data-user="{{ $ruko_user }}" data-local="{{ App::environment() == 'development' }}">
  <div style="width:100%; min-height:100%; padding-bottom: 100px; padding-top: 20px; background-color: #f8f8f8">
    <div class="ms-page-content">
      <div id="dashboard-body">
        
      </div>
    </div>
  </div>
  <script type="text/javascript" src="{{ asset('js/dashboard.js') }}"></script>
</body>
</html>