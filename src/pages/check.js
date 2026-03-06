import {account} from '../appwrite.js';

try {
    await account.get();
} catch(err) {
    window.location.href = './../../login.html';
}