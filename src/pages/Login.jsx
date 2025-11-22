/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function Login() {
  const {user, loginUser} = useAuth();
  const loginForm = useRef();

  // console.log(user);
  const navigate = useNavigate();
  useEffect(() => {
    if(user) {
      navigate('/admin');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = loginForm.current.email.value;
    const password = loginForm.current.password.value;
    const userInfo = {email, password};
    loginUser(userInfo);
  }

  return (
    <div className="form-container">
      <form className="admin-form" ref={loginForm} onSubmit={handleSubmit}>
        <div className="input-container">
          <input type="email" placeholder="" name="email" />
          <label htmlFor="email">email</label>
        </div>
        <div className="input-container">
          <input type="password" placeholder="" name="password" />
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}