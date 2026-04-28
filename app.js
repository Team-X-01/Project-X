import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, setDoc, serverTimestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyCx4fRoE_CI8FgZltRcj3OiVVYKfYEtuS8",
    authDomain: "project-x-tue9jun.firebaseapp.com",
    projectId: "project-x-tue9jun",
    storageBucket: "project-x-tue9jun.firebasestorage.app",
    messagingSenderId: "1046988091947",
    appId: "1:1046988091947:web:848b168aa997f8031b706e",
    measurementId: "G-23VNKR4TWE"
};

// --- DOM Element References ---
const welcomeScreen = document.getElementById('welcome-screen');
const welcomeForm = document.getElementById('welcome-form');
const welcomeUsernameInput = document.getElementById('welcome-username-input');
const mainChat = document.getElementById('main-chat');
const messagesDiv = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const editUsernameBtn = document.getElementById('edit-username');
const usernameModal = document.getElementById('username-modal');
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username-input');
const modalTitle = document.getElementById('modal-title');

// --- Firebase Initialization ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Global State ---
let currentUser = null;
let currentUsername = null;
let messagesUnsubscribe = null;

// --- Main Authentication Logic ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        await initializeUserSession(user);
    } else {
        signInAnonymously(auth).catch(error => {
            console.error("Anonymous sign-in failed:", error);
        });
    }
});

async function initializeUserSession(user) {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    let username = userDoc.exists() ? userDoc.data().username : null;

    if (!username) {
        showWelcomeScreen();
    } else {
        currentUsername = username;
        showChat();
    }
    listenForMessages(user.uid);
}

function showWelcomeScreen() {
    mainChat.style.display = 'none';
    welcomeScreen.style.display = 'flex'; // Use flex for centering
}

function showChat() {
    welcomeScreen.style.display = 'none';
    mainChat.style.display = 'flex'; // Use flex for the container
    enableChat();
}

welcomeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUsername = welcomeUsernameInput.value.trim();
    if (newUsername && currentUser) {
        await setDoc(doc(db, "users", currentUser.uid), { username: newUsername });
        currentUsername = newUsername;
        showChat();
    }
});

function listenForMessages(uid) {
    if (messagesUnsubscribe) messagesUnsubscribe();
    const msgCollection = collection(db, "messages");
    const q = query(msgCollection, orderBy("createdAt", "asc"));

    messagesUnsubscribe = onSnapshot(q, (snapshot) => {
        messagesDiv.innerHTML = '';
        snapshot.forEach((doc) => {
            renderMessage(doc.data(), uid);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

function renderMessage(data, currentUid) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', data.uid === currentUid ? 'yours' : 'theirs');

    const usernameSpan = document.createElement('span');
    usernameSpan.classList.add('username');
    usernameSpan.textContent = data.username || 'Anonymous';

    const textSpan = document.createElement('span');
    textSpan.classList.add('msg-text');
    textSpan.textContent = data.text;

    messageContainer.appendChild(usernameSpan);
    messageContainer.appendChild(textSpan);
    messagesDiv.appendChild(messageContainer);
}

// --- UI & Interaction Logic ---

function showUsernameModal(mode) {
    modalTitle.textContent = mode === 'edit' ? 'Change Username' : 'Welcome!';
    usernameInput.value = mode === 'edit' ? currentUsername : '';
    usernameModal.classList.add('active');
    usernameInput.focus();
}

function hideUsernameModal() {
    usernameModal.classList.remove('active');
}

function enableChat() {
    input.disabled = false;
    sendButton.disabled = false;
    input.placeholder = `Send message as ${currentUsername}`;
}

usernameForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUsername = usernameInput.value.trim();
    if (newUsername && currentUser) {
        await setDoc(doc(db, "users", currentUser.uid), { username: newUsername });
        currentUsername = newUsername;
        hideUsernameModal();
        enableChat();
    }
});

editUsernameBtn.addEventListener('click', () => {
    if (currentUser) {
        showUsernameModal('edit');
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const textVal = input.value.trim();
    if (textVal === '' || !currentUser || !currentUsername) return;

    try {
        await addDoc(collection(db, "messages"), {
            text: textVal,
            uid: currentUser.uid,
            username: currentUsername,
            createdAt: serverTimestamp()
        });
        input.value = '';
    } catch (error) {
        console.error("Error sending message:", error);
    }
});