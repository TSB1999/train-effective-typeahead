import React from "react";
import "./App.css";

import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function App() {
  const [query, setQuery] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [caughtCount, setCaughtCount] = React.useState(0);

  const { data, error } = useSWR(
    `https://api.github.com/users/${query}`,
    fetcher
  );

  const handleRequest = (counter) => {
    console.log(count, caughtCount);
    caughtCount === count && caughtCount != 0 && count != 0
      ? (
        console.log("Calling from GitHub")
      )
      : console.log("never mind");

    setCount(1);
    setCaughtCount(1);
  };

  const handleTextChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
    setCount(count + 1);
    setTimeout(() => {
      setCaughtCount(caughtCount + 1);
      handleRequest(count);
    }, 300);

    console.log(query);
  };

  if (error) return <h1>error</h1>

  return (
    <div className="App">
      <input
        type="text"
        name="song"
        placeholder="Search for GitHub users.."
        value={query}
        onChange={(e) => handleTextChange(e)}
      />
      {/* <div className="divider"/> */}

      <div className="drop-down-item-container">
        <div className="image-container">
          {/* <img src={data.avatar_url} className="profile-image" /> */}
        </div>
        <div className = "user-name-container">
          <h1>{JSON.stringify(data)}</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
