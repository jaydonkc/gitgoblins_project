// src/Form.jsx
import React, { useState } from "react";

function Form(props) {
  const [person, setPerson] = useState({
    name: "",
    email: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "email")
      setPerson({ name: person["name"], email: value });
    else setPerson({ name: value, email: person["email"] });
  }

  function submitForm() {
    props.handleSubmit(person);
    setPerson({ name: "", email: "" });
  }

  return (
    <form>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={person.name}
        onChange={handleChange}
      />
      <label htmlFor="email">Email</label>
      <input
        type="text"
        name="email"
        id="email"
        value={person.email}
        onChange={handleChange}
      />
      <input
        type="button"
        value="Submit"
        onClick={submitForm}
      />
    </form>
  );
}

export default Form;
