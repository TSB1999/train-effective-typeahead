import React from "react";
import "./App.css";

function App() {
  const [query, setQuery] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [caughtCount, setCaughtCount] = React.useState(0);

  const handleRequest = (counter) => {
    console.log(count, caughtCount);
    caughtCount === count && caughtCount != 0 && count != 0
      ? console.log("Calling from GitHub")
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

  return (
    <div className="App">
      <input
        type="text"
        name="song"
        // placeholder="Search for an album..."
        value={query}
        onChange={(e) => handleTextChange(e)}
      />
    </div>
  );
}

export default App;
