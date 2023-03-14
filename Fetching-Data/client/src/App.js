import { gql } from "graphql-tag";
import React, { useEffect, useState } from "react";
import { client } from "./components/Home";

const App = () => {
  let [data, setdata] = useState([]);
  useEffect(() => {
    client
      .query({
        query: gql`
          query ExampleQuery {
            posts {
              id
              login
              type
              avatar_url
            }
          }
        `,
      })
      .then((r) => {
        //setdata(r.data.posts);
        console.log(r);
      });
  }, []);

  // console.log("data", data);
  return (
    <div style={{ border: "1px solid black" }}>
      <div
        style={{
          background: "light grey",
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          border: "1px solid black",
        }}
      >
        {data.map((el) => (
          <div
            style={{
              border: "1px solid light grey",
              marginLeft: "20px",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
              boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            }}
          >
            {/* <img style={{ height: "300px" }} src={el.avatar_url} ></img> */}
            <h1>{el.login}</h1>
            <h1>{el.type}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
