// --- 1. ELEMENT SELECTIONS ---
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');

const authOverlay = document.getElementById('auth-overlay');
const loginBtn = document.getElementById('login-btn');
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

const navChat = document.getElementById('nav-chat');
const navBooks = document.getElementById('nav-books');
const navSettings = document.getElementById('nav-settings');

const chatSection = document.getElementById('chat-section');
const booksSection = document.getElementById('books-section');
const settingsSection = document.getElementById('settings-section');
const sectionTitle = document.getElementById('section-title');

const muteToggle = document.getElementById('mute-toggle');
const muteIcon = document.getElementById('mute-icon');
let isMuted = false; // Default awaaz on rahegi

// --- 2. AUTH, NAVIGATION & THEME LOGIC ---

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        authOverlay.style.opacity = '0';
        authOverlay.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            authOverlay.style.display = 'none';
        }, 600);
    });
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

function switchTab(activeSection, title, activeIcon) {
    [chatSection, booksSection, settingsSection].forEach(s => s.classList.add('hidden'));
    activeSection.classList.remove('hidden');
    sectionTitle.innerText = title;

    [navChat, navBooks, navSettings].forEach(icon => {
        icon.classList.remove('text-blue-600', 'dark:text-blue-400');
        icon.parentElement.classList.add('opacity-60');
    });

    activeIcon.classList.add('text-blue-600', 'dark:text-blue-400');
    activeIcon.parentElement.classList.remove('opacity-60');
}

navChat.addEventListener('click', () => switchTab(chatSection, 'AI Mentor Pro', navChat));
navBooks.addEventListener('click', () => switchTab(booksSection, 'Learning Library', navBooks));
navSettings.addEventListener('click', () => switchTab(settingsSection, 'Profile Settings', navSettings));

// --- 3. VOICE LOGIC ---
function speak(text) {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    let voices = window.speechSynthesis.getVoices();
    const setVoice = () => {
        voices = window.speechSynthesis.getVoices();
        // Try to find a premium female voice
        utterance.voice = voices.find(v => v.name.includes('Google US English')) || 
                         voices.find(v => v.lang.includes('en-US')) || 
                         voices[0];
        window.speechSynthesis.speak(utterance);
    };

    if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
        setVoice();
    }
}

// --- 4. CHAT FUNCTIONALITY ---

function typeWriter(text, element, speed = 15) {
    let i = 0;
    const parsedHTML = marked.parse(text); 
    element.innerHTML = ""; 
    
    function type() {
        if (i < parsedHTML.length) {
            element.innerHTML = parsedHTML.substring(0, i + 1);
            i++;
            let dynamicSpeed = Math.random() * speed + 5; 
            setTimeout(type, dynamicSpeed);
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            element.innerHTML = parsedHTML; 
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }
    type();
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${role === 'user' ? 'justify-end' : 'gap-4'} max-w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500`;

    msgDiv.innerHTML = role === 'user'
        ? `<div class="bg-blue-600 p-4 rounded-[1.5rem] rounded-tr-none text-sm max-w-[80%] shadow-lg text-white font-medium">${text}</div>`
        : `<div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <i data-lucide="bot" class="w-6 h-6 text-white"></i>
           </div>
           <div class="bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-5 rounded-[2rem] rounded-tl-none glass text-sm max-w-[80%] text-slate-900 dark:text-slate-200 backdrop-blur-md">${text}</div>`;

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

    const loadingDiv = document.createElement('div');
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
        speak(data.reply); // Voice response

    } catch (error) {
        loadingDiv.innerHTML = `<div class="text-red-500 text-sm p-4">Error: Server not connected.</div>`;
        lucide.createIcons();
    }
}

// --- 5. INITIALIZATION & LISTENERS ---

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        htmlElement.classList.remove('dark');
    } else {
        htmlElement.classList.add('dark');
    }
    lucide.createIcons();
});

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

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
}

window.addEventListener('contextmenu', (e) => e.preventDefault());

document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'BUTTON' && (target.innerText.includes("REVIEW") || target.innerText.includes("CONTINUE"))) {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2563eb', '#9333ea', '#10b981']
        });

        setTimeout(() => {
            switchTab(chatSection, 'AI Mentor Pro', navChat);
            userInput.value = `I want to review ${target.closest('.group').querySelector('h3').innerText}`;
            sendMessage();
        }, 800);
    }
});

