// src/MyApp.jsx
import { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);


  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function removeOneCharacter(id) {
    removeUser(id)
      .then((response) => {
        if (response.status === 204) {
          const updated = characters.filter((character) => {
            return character._id !== id;
          });
          setCharacters(updated);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          response.json().then((returnedPerson) => {
            setCharacters([...characters, returnedPerson]);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });

    return promise;
  }

  function removeUser(id) {
    return fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE"
    });
  }

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
