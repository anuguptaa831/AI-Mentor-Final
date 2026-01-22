// --- 1. ELEMENT SELECTIONS ---
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');

// Auth, Nav & Theme Elements
const authOverlay = document.getElementById('auth-overlay');
const loginBtn = document.getElementById('login-btn');
const themeToggle = document.getElementById('theme-toggle'); // Theme toggle selection
const htmlElement = document.documentElement; // HTML tag selection for class-based dark mode

const navChat = document.getElementById('nav-chat');
const navBooks = document.getElementById('nav-books');
const navSettings = document.getElementById('nav-settings');

// Sections
const chatSection = document.getElementById('chat-section');
const booksSection = document.getElementById('books-section');
const settingsSection = document.getElementById('settings-section');
const sectionTitle = document.getElementById('section-title');

// --- 2. AUTH, NAVIGATION & THEME LOGIC ---

// Login logic: Overlay ko hide karne ke liye
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        authOverlay.style.opacity = '0';
        authOverlay.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            authOverlay.style.display = 'none';
        }, 500);
    });
}

// Dark/Light Mode Switcher Logic
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark'); // Light mode enable karein
            localStorage.setItem('theme', 'light'); // Preference save karein
        } else {
            htmlElement.classList.add('dark'); // Dark mode enable karein
            localStorage.setItem('theme', 'dark'); // Preference save karein
        }
    });
}

// Tab Switching Function
function switchTab(activeSection, title, activeIcon) {
    // Sabhi sections chhupayein
    chatSection.classList.add('hidden');
    booksSection.classList.add('hidden');
    settingsSection.classList.add('hidden');
    
    // Sirf active section dikhayein
    activeSection.classList.remove('hidden');
    sectionTitle.innerText = title;

    // Icons ki styling update karein (Active state support for both modes)
    [navChat, navBooks, navSettings].forEach(icon => {
        icon.classList.remove('text-blue-600', 'text-blue-400');
        icon.parentElement.classList.add('opacity-60');
    });
    activeIcon.classList.add('text-blue-600', 'dark:text-blue-400');
    activeIcon.parentElement.classList.remove('opacity-60');
}

// Navigation Events
navChat.addEventListener('click', () => switchTab(chatSection, 'AI Mentor Pro', navChat));
navBooks.addEventListener('click', () => switchTab(booksSection, 'Learning Library', navBooks));
navSettings.addEventListener('click', () => switchTab(settingsSection, 'Profile Settings', navSettings));

// --- 3. CHAT FUNCTIONALITY ---

function typeWriter(text, element, speed = 10) {
    let i = 0;
    const parsedHTML = marked.parse(text); 
    element.innerHTML = ""; 
    
    function type() {
        if (i < parsedHTML.length) {
            element.innerHTML = parsedHTML.substring(0, i + 1);
            i++;
            setTimeout(type, speed);
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            element.innerHTML = parsedHTML; 
        }
    }
    type();
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${role === 'user' ? 'justify-end' : 'gap-4'} max-w-full mb-4`;
    
    msgDiv.innerHTML = role === 'user' 
        ? `<div class="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-sm max-w-[80%] shadow-lg text-white">${text}</div>`
        : `<div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <i data-lucide="bot" class="w-6 h-6 text-white"></i>
           </div>
           <div class="bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none glass text-sm max-w-[80%] text-slate-900 dark:text-slate-200">${text}</div>`;

    chatBox.appendChild(msgDiv);
    lucide.createIcons();
    chatBox.scrollTop = chatBox.scrollHeight;
    return role === 'ai' ? msgDiv.querySelectorAll('div')[1] : null;
}

async function sendMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;

    appendMessage('user', userText);
    userInput.value = '';

    const loadingId = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = loadingId;
    loadingDiv.className = "flex gap-4 max-w-3xl mb-4";
    
    loadingDiv.innerHTML = `
        <div class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <i data-lucide="bot" class="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse"></i>
        </div>
        <div class="bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl rounded-tl-none glass text-sm text-slate-500 dark:text-slate-400 italic">
            AI is thinking...
        </div>`;
    chatBox.appendChild(loadingDiv);
    lucide.createIcons();
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
        });
        const data = await response.json();
        loadingDiv.remove(); 
        
        const aiBubble = appendMessage('ai', ''); 
        typeWriter(data.reply, aiBubble); 

    } catch (error) {
        loadingDiv.innerHTML = `
            <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <i data-lucide="alert-circle" class="w-5 h-5 text-red-500"></i>
            </div>
            <div class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 p-4 rounded-2xl rounded-tl-none text-sm text-red-600 dark:text-red-400">
                Error: Server didn't connect.
            </div>`;
        lucide.createIcons();
    }
}

// --- 4. INITIALIZATION & LISTENERS ---

// Page load par theme apply karein
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        htmlElement.classList.remove('dark');
    } else {
        htmlElement.classList.add('dark'); // Default dark mode rakhein
    }
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

// Voice Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; 
    micBtn.addEventListener('click', () => {
        recognition.start();
        micBtn.classList.add('text-red-500', 'animate-pulse');
    });
    recognition.onresult = (event) => {
        userInput.value = event.results[0][0].transcript;
        micBtn.classList.remove('text-red-500', 'animate-pulse');
        sendMessage();
    };
    recognition.onerror = () => micBtn.classList.remove('text-red-500', 'animate-pulse');
} else {
    micBtn.style.display = 'none'; 
}

window.addEventListener('contextmenu', (e) => e.preventDefault());