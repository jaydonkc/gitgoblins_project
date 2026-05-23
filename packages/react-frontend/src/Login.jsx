import React, { useState } from "react";

function Login(props) {
  const [creds, setCreds] = useState({
    username: "",
    pwd: "",
    role: "adopter"
  });

  return (
    <form className="form-grid" onSubmit={submitForm}>
      <label className="field" htmlFor="username">
        <span>UserName</span>
        <input
          type="text"
          name="username"
          id="username"
          value={creds.username}
          onChange={handleChange}
          required
        />
      </label>
      <label className="field" htmlFor="password">
        <span>Password</span>
        <input
          type="password"
          name="password"
          id="password"
          value={creds.pwd}
          onChange={handleChange}
          required
        />
      </label>
      {props.showRoleChoice ? (
        <label className="field" htmlFor="role">
          <span>Account type</span>
          <select
            name="role"
            id="role"
            value={creds.role}
            onChange={handleChange}
          >
            <option value="adopter">Adopter</option>
            <option value="organization">Organization</option>
          </select>
        </label>
      ) : null}
      <button className="button primary" type="submit">
        {props.buttonLabel || "Log In"}
      </button>
    </form>
  );

  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setCreds({ ...creds, username: value });
        break;
      case "password":
        setCreds({ ...creds, pwd: value });
        break;
      case "role":
        setCreds({ ...creds, role: value });
        break;
      default:
        break;
    }
  }

  function submitForm(event) {
    event.preventDefault();
    props.handleSubmit(creds);
    setCreds({ username: "", pwd: "", role: "adopter" });
  }
}
export default Login;
