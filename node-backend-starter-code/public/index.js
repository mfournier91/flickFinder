(function(window, document, undefined){
window.onload = init;
  function init(){
    //start of our application after load
    var router = function(){ //function to make a client side router
      var url = location.hash.slice(1) || '/'; //gets the url after a hash. /#/ = /
      var view;
      console.log(url);
      var routes = {  // create routes which correspond to views
        '/' : 'searchPage',
        '/favorites' : 'favoritesPage'
      }
      var showExpression = /^(\/movie\/.+)$/g; //  /movie/:id equivalent
      if (showExpression.test(url)){
        view = 'showPage'
      }
      else {
      view = routes[url];  // views correspond to routes via our url
      }
      if (!view) {
        view = 'searchPage'; // default view is search page when invalid route given
      }
      renderView(view);
    }
    router();

    function renderView(view) {
      //hide all the pages
      var pages = document.getElementsByClassName('page');
      for(var i = 0; i < pages.length; i++){
        pages[i].style.display = 'none';
      }
      //show the page that corresponds with the current view
      var page = document.getElementById(view);
      page.style.display = '';
    }

    window.addEventListener("hashchange", router, false);  // run the router function again whenever the hash changes



    function getJSON(myUrl) {  // function that allows us to request json from a url; executes when we query our api
      var request = new XMLHttpRequest();
      request.open('GET', myUrl, true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);
          handleData(data); //once the data is parsed handle the data
        } else {
          console.log('The target server returned an error');
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

          var showLink = document.createElement('a'); //create a link to the individual movie
          showLink.setAttribute('href', '#/movie/' + movie["imdbID"]);

          var movieDiv = document.createElement('div'); //create a movie div with a class 'listedMovie' and an id equal to its imdbid
          movieDiv.className = 'listedMovie';
          movieDiv.setAttribute('id', movie["imdbID"]);

          var title = document.createTextNode(movie["Title"]) //give the div a paragraph with the title
          var titleP = document.createElement('p');
          titleP.appendChild(title);
          movieDiv.appendChild(showLink);
          showLink.appendChild(titleP);

          //giv the div an img of the poster
          var posterImg = document.createElement('img');
          posterImg.setAttribute('src', movie["Poster"]);
          posterImg.setAttribute('alt', movie["Title"]);
          showLink.appendChild(posterImg);

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
