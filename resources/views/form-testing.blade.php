<html lang="en">
  <body>
    <head>
      <title>Query test page</title>
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    </head>
    <div class="page-content flex-col">
      <h1>Query testing page</h1>
      <br/>
      Action
      <br/>
      <div style="display:flex; flex-wrap:wrap; justify-content: space-around;">
        <div><input type="radio" name="query" value="create" id="create"><label for="create">Create</label></div>
        <div><input type="radio" name="query" value="retrieve" id="retrieve"><label for="retrieve">Retrieve</label></div>
        <div><input type="radio" name="query" value="update" id="update"><label for="update">Update</label></div>
        <div><input type="radio" name="query" value="delete" id="delete"><label for="delete">Delete</label></div>
        <div><input type="radio" name="query" value="view" id="view"><label for="view">View page</label></div>
        <div><input type="radio" name="query" value="listing" id="listing"><label for="listing">Listing page</label></div>
        <div><input type="radio" name="query" value="creation-form" id="creation-form"><label for="creation-form">Creation form</label></div>
      </div>
      <br/>
      Entity
      <br/>
      <div style="display:flex; flex-wrap:wrap; justify-content: space-around">
        <div><input type="radio" name="entity" value="milestone" id="milestone"><label for="milestone">Milestone</label></div>
        <div><input type="radio" name="entity" value="goal" id="goal"><label for="goal">Goal</label></div>
        <div><input type="radio" name="entity" value="link" id="link"><label for="link">Link</label></div>
        <div><input type="radio" name="entity" value="comment" id="comment"><label for="comment">Comment</label></div>
        <div><input type="radio" name="entity" value="user" id="user"><label for="user">User</label></div>
      </div>
      <br/>
      Query
      <div style="width:100%; min-height: 50px; border: solid 1px black" id="request" contenteditable="true"></div>
      <br/>
      <input type="button" value="Submit" id="submit">
      <br/>
      Response
      <div style="width:100%; min-height: 50px; border: solid 1px black" id="response" contenteditable="true"></div>
    </div>
  </body>
  <script>
    function getQuery(){
      let q;
      try {
        q = JSON.parse($('#request').html());
      } catch(e) {
        q = { 
          destination: "",
          method: "",
          data: {},
          };
      }
      return q;
    }

    function writeQuery(query){
      $('#request').html(JSON.stringify(query));
    }

    $('input[name=entity],input[name=query]').on('click', (event) => {
      const qtype = $('input[name=query]:checked').val();
      const etype = $('input[name=entity]:checked').val();
      if (qtype && etype){
        makeQuery(qtype, etype);
      }
    });

    function makeQuery(action, entity){
      let verb, destination;
      switch (action){
        case "create":
          verb = "POST";
          destination = "api/" + entity;
        break;
        case "retrieve":
          verb = "GET";
          destination = "api/" + entity + "/retrieve/1";
        break;
        case "update":
          verb = "PATCH";
          destination = "api/" + entity + "/1";
        break;
        case "delete":
          verb = "DELETE";
          destination = "api/" + entity + "/1";
        break;
        case "view":
          verb = "GET";
          destination = "api/" + entity + "/1";
        break;
        case "listing":
          verb = "GET";
          destination = "api/" + entity;
        break;
        case "creation-form":
          verb = "GET";
          destination = "api/" + entity + "/create";
        break;
      }
      query = getQuery();
      query.destination = destination;
      query.method = verb;
      writeQuery(query);
    };

    $('#submit').on('click', () => {
      submitQuery(getQuery())
    });

    function submitQuery(q){
      if (!q.destination){
        return $('#response').html("No destination given!");
      }
      $.ajax({
        url: q.destination,
        type: q.method,
        data: q.data,
        success: handleResponse
      });
    }

    function handleResponse(resp){
      console.log(resp);
      let out = "";
      for (const [key, value] of Object.entries(resp)) {
         out += key + ": " + JSON.stringify(value) + "<br/>";
      }
      $('#response').html(out);
    }
  </script>
</html>