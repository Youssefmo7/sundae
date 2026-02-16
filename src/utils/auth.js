import { account } from '../appwrite.js';

async function loginUser(email, password) {
  try {
    const session = await account.createEmailPasswordSession({email: email, password: password});
    const user = await account.get();
    return {
      success: true,      
      user: user,
      session: session
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function logoutUser() {
  try {
    await account.deleteSession('current');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

export default { loginUser, logoutUser };