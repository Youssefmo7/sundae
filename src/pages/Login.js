import auth from '../utils/auth.js';

let form = document.getElementById('login-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;

  try {
    const login = await auth.loginUser(email, password);
    if(login.success)
    {
      localStorage.setItem('user', JSON.stringify(login.user));
      window.location.href = './admin.html';
    }
    else {
      document.querySelector('.error-message').textContent = login.error;
      console.log("fail");
    }
  } catch (error) {
  }
});