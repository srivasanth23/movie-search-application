import React from "react";
import "./index.css";
import LoaderView from "../LoaderView";

const Website = () => {
  const [searchvalue, setSearchvalue] = React.useState("");
  const [fetched, setFetched] = React.useState(false);
  const [loading, setLoader] = React.useState(false);
  const [movieslist, setmovieslist] = React.useState([]);
  const [errormsg, seterror] = React.useState(false);
  const [currentpage, setcurrentpage] = React.useState(1);
  const [totalpages, settotalpages] = React.useState(1);

  const addClassForDiv = fetched ? "flexStart" : "flexCenter";

  const shortner = (item) => {
    if (item.length > 25) {
      return item.substring(0, 25) + "...";
    }
    return item || "Unknown";
  };

  const fetchmovies = async (page) => {
    // console.log("Hello World");
    try {
      setLoader(true);
      setFetched(false);
      setmovieslist([]);
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${searchvalue}&page=${page}`
      );
      const data = await res.json();
      const movies = await data.docs;
      const totalResults = await data.num_found;
      settotalpages(Math.ceil(totalResults / 100));

      const dogImagefetcher = movies.map(() =>
        fetch("https://dog.ceo/api/breeds/image/random").then((res) =>
          res.json()
        )
      );
      const dogImage = await Promise.all(dogImagefetcher);

      const movieCards = movies.map((movie, index) => ({
        title: shortner(movie.title),
        author: movie.author_name
          ? shortner(movie.author_name.join(","))
          : "Unknown Author",
        publicationDate: movie.first_publish_year || "N/A",
        dogImage: dogImage[index].message,
      }));

      setmovieslist(movieCards);
      setFetched(true);
      // console.log(movieCards);
      setLoader(false);
    } catch (e) {
      console.log("Error", e);
      setLoader(false);
    }
  };

  const onClickSearch = () => {
    if (searchvalue.length === 0) {
      seterror(true);
      setmovieslist([]);
      setLoader(false);
    } else {
      seterror(false);
      setcurrentpage(1);
      fetchmovies(1);
    }
  };

  const handlePageChange = (direction) => {
    const newpage = currentpage + direction;
    if (newpage > 0 && newpage <= totalpages) {
      setcurrentpage(newpage);
      fetchmovies(newpage);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onClickSearch();
    }
  };

  return (
    <div className={`paddings w-container ${addClassForDiv}`}>
      <h1>Mega Movies 🎬🔍</h1>
      <p className="w-para">Search about movies in mega movies...</p>
      <div className="flexRowCenter s-container">
        <input
          type="search"
          alt="SearchBar"
          placeholder="Search for any movie"
          className="s-elem"
          value={searchvalue}
          onChange={(e) => setSearchvalue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          type="button"
          alt="button"
          className="btnElem"
          onClick={onClickSearch}
        >
          Search
        </button>
      </div>
      {loading ? <LoaderView /> : ""}
      {errormsg ? (
        <p style={{ color: "red" }}>Please enter any movie name.</p>
      ) : (
        ""
      )}
      <ul className="cards-container paddings">
        {movieslist.length > 0
          ? movieslist.map((movie, index) => (
              <li
                key={index}
                className="card"
                style={{ backgroundColor: "white" }}
              >
                <img
                  src={movie.dogImage}
                  alt="Random Dog"
                  className="card-image"
                />
                <div
                  className="card-content"
                  style={{ backgroundColor: "white", color: "#1d1c1c" }}
                >
                  <h3>{movie.title}</h3>
                  <p>{movie.author}</p>
                  <p>{movie.publicationDate}</p>
                </div>
              </li>
            ))
          : ""}
      </ul>
      {fetched && movieslist.length === 0 && !errormsg ? (
        <p className="w-self-para">No movies found. Try another search term.</p>
      ) : (
        !fetched && (
          <p className="w-self-para">
            Thanks for this assignment Vaapas. Made with love by JSV
          </p>
        )
      )}
      {fetched && !loading && movieslist.length > 0 && (
        <div className="pagination flexRowCenter">
          <button
            onClick={() => handlePageChange(-1)}
            disabled={currentpage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentpage} of {totalpages}
          </span>
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentpage === totalpages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Website;
