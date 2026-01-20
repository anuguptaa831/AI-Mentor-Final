const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

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

// 1. Bot Icon  update 
function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${role === 'user' ? 'justify-end' : 'gap-4'} max-w-full`;
    
    msgDiv.innerHTML = role === 'user' 
        ? `<div class="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-sm max-w-[80%] shadow-lg">${text}</div>`
        : `<div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <i data-lucide="bot" class="w-6 h-6 text-white"></i>
           </div>
           <div class="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl rounded-tl-none glass text-sm max-w-[80%]">${text}</div>`;

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
    loadingDiv.className = "flex gap-4 max-w-3xl";
    
    // 2. Thinking indicator mein Bot icon aur pulse animation add kiya
    loadingDiv.innerHTML = `
        <div class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
            <i data-lucide="bot" class="w-5 h-5 text-blue-400 animate-pulse"></i>
        </div>
        <div class="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl rounded-tl-none glass text-sm text-slate-400 italic">
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
        document.getElementById(loadingId).remove();
        
        const aiBubble = appendMessage('ai', ''); 
        typeWriter(data.reply, aiBubble); 

    } catch (error) {
        // 3. Error state mein bhi icon ko rakha hai
        const errElement = document.getElementById(loadingId);
        errElement.innerHTML = `
            <div class="w-10 h-10 rounded-xl bg-red-900/30 flex items-center justify-center shrink-0">
                <i data-lucide="alert-circle" class="w-5 h-5 text-red-500"></i>
            </div>
            <div class="bg-red-900/10 border border-red-500/20 p-4 rounded-2xl rounded-tl-none text-sm text-red-400">
                Error: Server didn't connect.
            </div>`;
        lucide.createIcons();
    }
}
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

const micBtn = document.getElementById('mic-btn');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; 

    micBtn.addEventListener('click', () => {
        recognition.start();
        micBtn.classList.add('text-red-500', 'animate-pulse');
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        micBtn.classList.remove('text-red-500', 'animate-pulse');
        sendMessage();
    };

    recognition.onerror = () => {
        micBtn.classList.remove('text-red-500', 'animate-pulse');
    };
} else {
    micBtn.style.display = 'none'; 
}

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Navigation Elements
const navChat = document.getElementById('nav-chat');
const navBooks = document.getElementById('nav-books');
const navSettings = document.getElementById('nav-settings');

// Section Containers
const chatSection = document.getElementById('chat-section');
const booksSection = document.getElementById('books-section');
const settingsSection = document.getElementById('settings-section');
const sectionTitle = document.getElementById('section-title');

function switchTab(activeSection, title) {
    // Sabko chhupao
    chatSection.classList.add('hidden');
    booksSection.classList.add('hidden');
    settingsSection.classList.add('hidden');
    
    // Sirf active ko dikhao
    activeSection.classList.remove('hidden');
    sectionTitle.innerText = title;
}

// Click Events
navChat.addEventListener('click', () => switchTab(chatSection, 'AI Mentor Pro'));
navBooks.addEventListener('click', () => switchTab(booksSection, 'Course Library'));
navSettings.addEventListener('click', () => switchTab(settingsSection, 'Profile Settings'));

document.querySelectorAll('button').forEach(btn => {
    if (btn.innerText.includes("CONTINUE") || btn.innerText.includes("REVIEW")) {
        btn.addEventListener('click', () => {
            switchTab(chatSection, 'AI Mentor Pro', navChat);
        });
    }
});