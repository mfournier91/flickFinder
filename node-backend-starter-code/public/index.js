(function(window, document, undefined){
window.onload = init;
  function init(){
    //start of our application after load
    function getJSON(myUrl) {  // function that allows us to request json from a url; executes when we query our api
      var request = new XMLHttpRequest();
      request.open('GET', myUrl, true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);
          handleData(data); //once the data is parsed handle the data
        } else {
          console.log('The targer server returned an error');
        }
      };

      request.onerror = function() {
        console.log('There was a connection error');
      };
      request.send()
    }

    function handleData(data){ //function for handling data
      //Delete previous search results
      var searchResults = document.getElementById('searchResults');
      searchResults.parentNode.removeChild(searchResults);
      //add in the div that was deleted but now empty
      searchResults = document.createElement('div');
      searchResults.setAttribute('id', 'searchResults');
      searchPage.appendChild(searchResults);

      //If the data has a property search we know it came from the search api which returns an array of movies
      if(data["Search"]) {
        data["Search"].forEach((movie) => { //for each movie
          //console.log(movie.Title);
          var movieDiv = document.createElement('div'); //create a movie div with a class 'listedMovie' and an id equal to its imdbid
          movieDiv.className = 'listedMovie';
          movieDiv.setAttribute('id', movie["imdbID"]);

          var title = document.createTextNode(movie["Title"]) //give the div a paragraph with the title
          var titleP = document.createElement('p');
          titleP.appendChild(title);
          movieDiv.appendChild(titleP);

          //giv the div an img of the poster
          var posterImg = document.createElement('img');
          posterImg.setAttribute('src', movie["Poster"]);
          posterImg.setAttribute('alt', movie["Title"]);
          movieDiv.appendChild(posterImg);
          //append the results to the div that contains our results
          searchResults.appendChild(movieDiv);
        })
      }
    }

    //get the searh form
    var searchForm = document.getElementById('searchForm');
    var searchPage = document.getElementById('searchPage');
    searchForm.addEventListener('submit', function(e) { //add a listener for submit
      e.preventDefault();
      var searchTerm = e.target.title.value;
      searchTerm = searchTerm.split(' ').join('%20'); //format the search term correctly
      getJSON('https://omdbapi.com/?s=' + searchTerm); //query the api
    });




  }
})(window, document, undefined);
