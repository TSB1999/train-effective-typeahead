// REACT LIBRARY IMPORTS
import React, { useEffect, useContext } from "react";

// GLOBAL STORE INPUTS
import { IndexContext } from "../IndexContext";
import IndexStore from "../stores/IndexStore";
import { observer } from "mobx-react";

// DATA FETCHING IMPORTS
import useSWR from "swr";

/* ------------------------------------- */

// MY ACCESS TOKEN WILL ALLOW FOR 1000 REQUESTS / HR
const PERSONAL_ACCESS_TOKEN = "3a8b2a73d5047eda6b1f7b61c5da338546edb7ce";

// FETCHER HANDLER FOR USESWR LIBRARY
const fetcher = (...args) =>
  fetch(...args, {
    method: "get",
    headers: new Headers({
      Authorization: `token ${PERSONAL_ACCESS_TOKEN}`,
    }),
  }).then((res) => res.json());

function Interface() {
  // USESTATE DECLARATIONS
  const [caughtCount, setCaughtCount] = React.useState(0);
  const [called, setCalled] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [count, setCount] = React.useState(0);
  const [term, setTerm] = React.useState("");

  // USECONTEXT DECLARATIONS
  const { value, setValue } = useContext(IndexContext);

  // USEEFFECT DECLARTIONS
  useEffect(() => {
    if (data && data.login) {
      const item = {
        user: data.login,
        image: data.avatar_url,
      };
      IndexStore.cache.add(JSON.stringify(item)); // SERIALISE OBJECT TO ENSURE NON-DUPLICATE VALUES IN SET
    }
  }, [() => term]); // CALLBACK DEPENDENCY DUE TO ASYNC NATURE OF SETTIMEOUT

  // USESWR DECLARATIONS
  const { data, error } = useSWR(
    `https://api.github.com/users/${term}`,
    fetcher
  );

  // METHOD TO HANDLE INPUT TEXT CHANGE
  const handleTextChange = (e) => {
    e.preventDefault();

    const searchQuery = e.target.value;

    IndexStore.index.push(searchQuery.length);

    setQuery(e.target.value);
    setCount(count + 1);
    setTimeout(() => {
      setCaughtCount(caughtCount + 1);
      handleRequest(searchQuery);
    }, 300);
  };

  // REQUESTS ENGINE
  const handleRequest = (query) => {
    const index = query.length;

    if (caughtCount === count && caughtCount != 0 && count != 0) {
      // TIME TO MAKE A REQUEST
      // ENGINE DOES NOT MAKE REQUEST IF THE USER IS ALREADY IN CACHE
      if (!IndexStore.cache.has(query)) {
        setTerm(query);
      }
      setCalled(true);
    } else {
      setCalled(false);
      // USER IS TYPING TOO FAST. NO NEED TO MAKE A REQUEST
      setTimeout(() => {
        if (!called) {
          if (index === IndexStore.index[IndexStore.index.length - 1]) {
            // TIME TO MAKE A REQUEST
            // ENGINE DOES NOT MAKE REQUEST IF THE USER IS ALREADY IN CACHE
            if (!IndexStore.cache.has(query)) {
              setTerm(query);
            }
          }
        }
      }, [1000]);
    }

    //  RESET HOOKS FOR NEXT INPUT CHANGE CYCLE
    setCount(1);
    setCaughtCount(1);
    setCalled(false);
  };

  if (error) return <h1>error</h1>;

  return (
    <div className="top-level-container">
      <div className="header">
        <input
          type="text"
          name="song"
          placeholder="Search for GitHub users..."
          value={query}
          onChange={(e) => handleTextChange(e)}
        />
      </div>

      <div className="body">
        {(term.toLowerCase() === "" && [...IndexStore.cache]).length > 0 ? (
          <h1>history</h1>
        ) : null}

        {[...IndexStore.cache]
          .filter((item) => {
            if (
              JSON.parse(item).user.toLowerCase().includes(term.toLowerCase())
            ) {
              return JSON.parse(item).user;
            }
          })
          .map((item) => {
            if (!data) {
              return <h1>loading</h1>;
            } else
              return (
                <div className="drop-down-item-container">
                  <div className="image-container">
                    <img
                      src={JSON.parse(item).image}
                      className="profile-image"
                    />
                  </div>
                  <div className="user-name-container">
                    <h1>{JSON.parse(item).user}</h1>
                  </div>
                </div>
              );
          })}
      </div>

      {/* <div className="footer">
          <h1>footer</h1>
      </div> */}
    </div>
  );
}

export default observer(Interface);
