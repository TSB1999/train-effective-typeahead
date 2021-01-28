import React, { useEffect, useContext } from "react";
import { IndexContext } from "../IndexContext";
import IndexStore from "../stores/IndexStore";
import { observer } from "mobx-react";

import useSWR from "swr";

const PERSONAL_ACCESS_TOKEN = "3a8b2a73d5047eda6b1f7b61c5da338546edb7ce";

// let cache = new Set();

const fetcher = (...args) =>
  fetch(...args, {
    method: "get",
    headers: new Headers({
      Authorization: `token ${PERSONAL_ACCESS_TOKEN}`,
    }),
  }).then((res) => res.json());

function Interface() {
  const [query, setQuery] = React.useState("");
  const [term, setTerm] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [caughtCount, setCaughtCount] = React.useState(0);
  const [called, setCalled] = React.useState(false);
  const [result, setResult] = React.useState(new Set());

  const { value, setValue } = useContext(IndexContext);

  const { data, error } = useSWR(
    `https://api.github.com/users/${term}`,
    fetcher
  );

  useEffect(() => {
    const item = {
      user: JSON.stringify(data),
      image: JSON.stringify(data),
    };

    if (data && data.login) {
      const item = {
        user: data.login,
        image: data.avatar_url,
      };

      IndexStore.cache.add(JSON.stringify(item));
      // console.log(cache);
    }
  }, [() => term]);

  const handleRequest = (counter, query) => {
    const index = query.length;

    if (caughtCount === count && caughtCount != 0 && count != 0) {
      // console.log("Calling from GitHub", index);
      setTerm(query);
      setCalled(true);
    } else {
      setCalled(false);
      // console.log("never mind", index);
      setTimeout(() => {
        if (!called) {
          if (index === IndexStore.index[IndexStore.index.length - 1]) {
            // console.log("Calling from GitHub-2", index);
            setTerm(query);
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
    // console.log(IndexStore.index, "contetr");

    setQuery(e.target.value);
    setCount(count + 1);
    setTimeout(() => {
      setCaughtCount(caughtCount + 1);
      handleRequest(count, searchQuery);
    }, 300);
  };

  if (error) return <h1>error</h1>;

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

      <div>
        {[...IndexStore.cache]
        .filter((item) => {
          if (JSON.parse(item).user.toLowerCase().includes(term.toLowerCase())) {
            return JSON.parse(item).user;
          }
        })
        .map((item) => (
          <div className="drop-down-item-container">
            <div className="image-container">
              <img src={JSON.parse(item).image} className="profile-image" />
            </div>
            <div className="user-name-container">
              <h1>{JSON.parse(item).user}</h1>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="drop-down-item-container">
        <div className="image-container">
          <img src={data ? data.avatar_url : null} className="profile-image" />
        </div>
        <div className="user-name-container">
          <h1>{data ? data.login : null}</h1>
        </div>
      </div> */}
    </div>
  );
}

export default observer(Interface);
