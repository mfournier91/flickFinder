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
      //determine how to proceed
      if (view == 'showPage') {
        var movieId = location.hash.slice(1).split('/movie/')[1];
        console.log(movieId);
        getJSON('https://omdbapi.com/?i='+movieId, view);
      }

    }

    window.addEventListener("hashchange", router, false);  // run the router function again whenever the hash changes



    function getJSON(myUrl, view) {  // function that allows us to request json from a url; executes when we query our api
      var request = new XMLHttpRequest();
      request.open('GET', myUrl, true);

      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.responseText);
          console.log(data);
          handleData(data, view); //once the data is parsed handle the data
        } else {
          console.log('The target server returned an error');
        }
      };

      request.onerror = function() {
        console.log('There was a connection error');
      };
      request.send()
    }

    function handleData(data, view){ //function for handling data

      //If the data has a property search we know it came from the search api which returns an array of movies
      if(data["Search"]) {
        //Delete previous search results
        var searchResults = document.getElementById('searchResults');
        searchResults.parentNode.removeChild(searchResults);
        //add in the div that was deleted but now empty
        searchResults = document.createElement('div');
        searchResults.setAttribute('id', 'searchResults');
        searchPage.appendChild(searchResults);

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
      else if (data["Title"] && view == 'showPage'){
        console.log('render the show data');
        //Delete previous show result
        var showResult = document.getElementById('showResult');
        showResult.parentNode.removeChild(showResult);
        //add in the div that was deleted but now empty
        showResult = document.createElement('div');
        showResult.setAttribute('id', 'showResult');
        showPage.appendChild(showResult);

        //Title
        var title = document.createTextNode(data["Title"]);
        var titleH = document.createElement('h2');
        titleH.appendChild(title);
        showResult.appendChild(titleH);
        //Poster
        var posterImg = document.createElement('img');
        posterImg.setAttribute('src', data["Poster"]);
        posterImg.setAttribute('alt', data["Title"]);
        showResult.appendChild(posterImg);
        //Plot
        var plot = document.createTextNode(data["Plot"]);
        var plotP = document.createElement('p');
        plotP.appendChild(plot);
        showResult.appendChild(plotP);
        //Genre
        var genre = document.createTextNode(data["Genre"]);
        var genreH = document.createElement('h5');
        genreH.appendChild(genre);
        showResult.appendChild(genreH);
        //To Do: add button to add to favorites.

      }
    }

    //get the searh form
    var searchForm = document.getElementById('searchForm');
    var searchPage = document.getElementById('searchPage');
    var showPage = document.getElementById('showPage');
    var favoritePage = document.getElementById('favoritePage');
    searchForm.addEventListener('submit', function(e) { //add a listener for submit
      e.preventDefault();
      var searchTerm = e.target.title.value;
      searchTerm = searchTerm.split(' ').join('%20'); //format the search term correctly
      getJSON('https://omdbapi.com/?s=' + searchTerm, 'searchPage'); //query the api
    });




  }
})(window, document, undefined);
