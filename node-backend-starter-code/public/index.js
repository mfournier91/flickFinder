(function(window, document, undefined){
window.onload = init;
  function init(){
    //start of our application after load

    function getJSON(myUrl) {  // function that allows us to request json from a url
      console.log(myUrl);
      var request = new XMLHttpRequest();
      request.open('GET', myUrl, true);

      request.onload = function() {
        console.log('on load');
        if (request.status >= 200 && request.status < 400) {
          console.log('request is good');
          var data = JSON.parse(request.responseText);
          handleData(data);
        } else {
          console.log('The targer server returned an error');
        }
      };

      request.onerror = function() {
        console.log('There was a connection error');
      };
      request.send()
    }

    function handleData(data){
      console.log('i can handle this', data);
      if(data["Search"]) {
        console.log("We got an array back. Time to append a div for each movie");
      }
    }

    //get the searh form
    var searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) { //add a listener for submit
      e.preventDefault();
      var searchTerm = e.target.title.value;
      searchTerm = searchTerm.split(' ').join('%20'); //format the search term correctly
      getJSON('https://omdbapi.com/?s=' + searchTerm); //query the api
    });




  }
})(window, document, undefined);
