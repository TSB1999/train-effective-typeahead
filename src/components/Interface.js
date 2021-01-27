import React, { useEffect, useState, useContext } from "react";
import { IndexContext } from "../IndexContext";
import IndexStore from "../stores/IndexStore";
import { observer } from "mobx-react";

import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function Interface() {
  const [query, setQuery] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [caughtCount, setCaughtCount] = React.useState(0);
  const [called, setCalled] = React.useState(false);
  const [indexArray, setIndexArray] = React.useState([0]);

  const { value, setValue } = useContext(IndexContext);

  // const { data, error } = useSWR(
  //   `https://api.github.com/users/${query}`,
  //   fetcher
  // );

  const handleRequest = (counter, query) => {
    const index = query.length;

    if (caughtCount === count && caughtCount != 0 && count != 0) {
      console.log("Calling from GitHub", index);
      setCalled(true);
    } else {
      setCalled(false);
      console.log("never mind", index); 
      setTimeout(() => {
        if (!called) {
          if (index === IndexStore.index[IndexStore.index.length - 1]) {
            console.log("Calling from GitHub-2", index);
          }
        }
      }, [1000]);
    }

    setCount(1);
    setCaughtCount(1);
    setCalled(false);
  };

  const handleTextChange = (e) => {
    e.preventDefault();

    const searchQuery = e.target.value;

    IndexStore.index.push(searchQuery.length);
    console.log(IndexStore.index, "contetr");

    setQuery(e.target.value);
    setCount(count + 1);
    setTimeout(() => {
      setCaughtCount(caughtCount + 1);
      handleRequest(count, searchQuery);
    }, 300);
  };

  return (
    <div>
      <input
        type="text"
        name="song"
        placeholder="Search for GitHub users..."
        value={query}
        onChange={(e) => handleTextChange(e)}
      />
      {/* <div className="divider"/> */}

      {/* <div className="drop-down-item-container">
        <div className="image-container">
          <img src={data.avatar_url} className="profile-image" />
        </div>
        <div className = "user-name-container">
          <h1>{JSON.stringify(data)}</h1>
        </div>
      </div> */}
    </div>
  );
}

export default observer(Interface);
