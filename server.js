const express = require('express');
const cors = require('cors');

const app = express();

// Middleware - Frontend connection allow karne ke liye
app.use(cors()); 
app.use(express.json()); 

const PORT = 5000;

// Main Chat Route
app.post('/chat', (req, res) => {
    try {
        const { message } = req.body;
        const userMsg = message.toLowerCase();
        let reply = "";

        // 1. Greeting & Introduction
        if (userMsg.includes("hi") || userMsg.includes("hello") || userMsg.includes("kaun")) {
            reply = "Hello! I am your AI Mentor Pro. I will help you learn Full Stack Development. What shall we study today? (Java, Python, or Web Dev?)";
        } 
        // 2. Technical Mentor Logic
        else if (userMsg.includes("java")) {
            reply = "Java is a high-level, class-based language. Pehle **Variables aur Data Types** samjhein. Kya aapko code example chahiye?";
        } 
        // 3. Motivational Prompt
        else if (userMsg.includes("darr") || userMsg.includes("hard")) {
            reply = "Coding may feel tough starting out, but it is all about staying consistent! Build small projects to start, and remember, I am here to help you.";
        }
        // 4. Default Response
        else {
            reply = "Great question! As a mentor, I would suggest we break this down step-by-step. While my API Key is being processed, I can help with the basics.";
        }

        res.json({ reply: reply }); 

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "The server is feeling a bit tired; let's give it a refresh." });
    }
});

// Server Start
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`✅ SERVER ready!`);
    console.log(`🚀 Address: http://localhost:${PORT}`);
    console.log(`=================================`);
});




















// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>AI Mentor Pro | Next-Gen Learning</title>
//     <script src="https://cdn.tailwindcss.com"></script>
//     <script src="https://unpkg.com/lucide@latest"></script>
//     <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
//     <link rel="stylesheet" href="style.css">
// </head>

// <body class="bg-[#0f172a] text-slate-200 h-screen overflow-hidden font-sans">

//     <div class="flex flex-col md:flex-row h-full w-full">

//         <aside class="w-full md:w-20 bg-[#1e293b] flex flex-row md:flex-col items-center py-3 md:py-8 border-b md:border-r border-slate-700 justify-around md:justify-start md:space-y-8 z-30 shrink-0">
//             <div class="p-2 bg-blue-600 rounded-xl shadow-lg">
//                 <i data-lucide="bot" class="w-6 h-6 text-white"></i>
//             </div>
//             <nav class="flex flex-row md:flex-col gap-6 md:gap-10 opacity-60">
//                 <i id="nav-chat" data-lucide="layout-dashboard" class="w-6 h-6 cursor-pointer hover:text-blue-400 transition-colors"></i>
//                 <i id="nav-books" data-lucide="book-open" class="w-6 h-6 cursor-pointer hover:text-blue-400 transition-colors"></i>
//                 <i id="nav-settings" data-lucide="settings" class="w-6 h-6 cursor-pointer hover:text-blue-400 transition-colors"></i>
//             </nav>
//         </aside>

//         <main class="flex-1 flex flex-col bg-[#0f172a] overflow-hidden min-w-0">
//             <header class="h-16 border-b border-slate-800 flex items-center px-6 shrink-0">
//                 <h1 id="section-title" class="text-lg font-bold">AI Mentor Pro</h1>
//             </header>

//             <div id="chat-section" class="flex-1 flex flex-col overflow-hidden">
//                 <div id="chat-box" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
//                     <div class="flex gap-4 max-w-3xl">
//                         <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
//                             <i data-lucide="bot" class="w-6 h-6 text-white"></i>
//                         </div>
//                         <div class="bg-slate-800/40 border border-slate-700 p-4 rounded-2xl rounded-tl-none glass text-sm">
//                             Hello, I am your AI mentor. What topic are we going to cover today?
//                         </div>
//                     </div>
//                 </div>

//                 <footer class="p-4 bg-[#0f172a] border-t border-slate-800/50">
//                     <div class="max-w-4xl mx-auto flex gap-2 items-center bg-slate-800/40 border border-slate-700 p-2 rounded-2xl">
//                         <input type="text" id="user-input" placeholder="Ask anything..." class="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm">
//                         <button id="mic-btn" class="p-2 text-slate-400 hover:text-blue-400"><i data-lucide="mic" class="w-5 h-5"></i></button>
//                         <button id="send-btn" class="bg-blue-600 p-2 rounded-xl"><i data-lucide="send" class="w-5 h-5 text-white"></i></button>
//                     </div>
//                 </footer>
//             </div>

//             <div id="books-section" class="hidden flex-1 overflow-y-auto p-6 space-y-6 bg-[#0f172a]">
//                 <h2 class="text-xl font-bold mb-4">Library & Lessons</h2>
//                 <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div class="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
//                         <i data-lucide="code" class="text-blue-400 mb-3"></i>
//                         <h3 class="font-bold">Java Masterclass</h3>
//                         <p class="text-xs text-slate-400 mt-1">From Syntax to Advanced OOPs concepts.</p>
//                     </div>
//                     <div class="bg-white/5 border border-white/10 p-5 rounded-2xl opacity-50">
//                         <i data-lucide="lock" class="text-slate-500 mb-3"></i>
//                         <h3 class="font-bold">Database Management</h3>
//                         <p class="text-xs text-slate-400 mt-1">Unlock this after completing Java.</p>
//                     </div>
//                 </div>
//             </div>

//             <div id="settings-section" class="hidden flex-1 p-6 bg-[#0f172a]">
//                 <h2 class="text-xl font-bold mb-4">Settings</h2>
//                 <div class="space-y-4 max-w-md">
//                     <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
//                         <span>Voice Feedback</span>
//                         <div class="w-10 h-5 bg-blue-600 rounded-full relative"><div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
//                     </div>
//                     <div class="p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-slate-400">
//                         Model: GPT-4 Turbo (Mentor Edition)
//                     </div>
//                 </div>
//             </div>
//         </main>

//         <aside class="w-full md:w-72 lg:w-80 bg-[#1e293b]/30 border-t md:border-t-0 md:border-l border-slate-800 p-6 overflow-y-auto shrink-0">
//             <h3 class="text-lg font-semibold mb-6">Learning Progress</h3>
//             <div class="bg-white/5 p-5 rounded-3xl border border-white/5 mb-6">
//                 <div class="flex justify-between text-xs mb-2">
//                     <span class="text-slate-400">Java Basics</span>
//                     <span class="text-blue-400 font-bold">70%</span>
//                 </div>
//                 <div class="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
//                     <div class="bg-blue-500 h-full w-[70%] shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
//                 </div>
//             </div>
//             <div class="space-y-4">
//                 <h4 class="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Upcoming</h4>
//                 <div class="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-sm opacity-50">
//                     <i data-lucide="lock" class="w-4 h-4"></i> API Integration
//                 </div>
//             </div>
//         </aside>
//     </div>

//     <script>lucide.createIcons();</script>
//     <script src="script.js"></script>
// </body>
// </html>  