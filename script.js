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
            element.innerHTML = parsedHTML; // Final touch for perfect formatting
        }
    }
    type();
}

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${role === 'user' ? 'justify-end' : 'gap-4'} max-w-full`;
    
    msgDiv.innerHTML = role === 'user' 
        ? `<div class="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-sm max-w-[80%] shadow-lg">${text}</div>`
        : `<div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0"><i data-lucide="sparkles" class="w-5 h-5 text-white"></i></div>
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
    loadingDiv.className = "flex gap-4 max-w-3xl loading-pulse";
    loadingDiv.innerHTML = `<div class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center shrink-0"><i data-lucide="bot" class="w-5 h-5 text-blue-400"></i></div>
                            <div class="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl rounded-tl-none glass text-sm text-slate-400 italic">AI is thinking...</div>`;
    chatBox.appendChild(loadingDiv);
    lucide.createIcons();

    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userText })
        });
        const data = await response.json();
        document.getElementById(loadingId).remove();
        
        const aiBubble = appendMessage('ai', ''); // Pehle khali bubble
        typeWriter(data.reply, aiBubble); // Phir typing effect

    } catch (error) {
        document.getElementById(loadingId).innerText = "Error: Server se connect nahi ho paya.";
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
    micBtn.style.display = 'none'; // Agar browser support na kare

}
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    // Yahan hum apna custom menu dikha sakte hain (Future upgrade)
    console.log("Custom menu triggered!");
});