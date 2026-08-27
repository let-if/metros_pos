
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Send } from 'lucide-react';

// export default function TelegramReceiptSelector({ selectedChatId, onSelectChat }) {
//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchRecentChats = async () => {
//     try {
//       setLoading(true);
//       // Direct call to port 5000 to fetch active chat sessions
//       const res = await axios.get('http://localhost:5000/api/telegram/recent-chats');
//       setChats(res.data.chats || []);
//     } catch (err) {
//       console.error('Failed to fetch Telegram chats:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecentChats();
//     const interval = setInterval(fetchRecentChats, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="space-y-1.5">
//       <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center justify-between">
//         <span className="flex items-center gap-1">
//           <Send className="h-3 w-3 text-sky-600" /> Send Digital Receipt via Telegram
//         </span>
//         <button 
//           type="button" 
//           onClick={fetchRecentChats} 
//           className="text-[9px] text-sky-600 hover:underline cursor-pointer"
//         >
//           {loading ? 'Refreshing...' : 'Refresh Chats'}
//         </button>
//       </label>

//       <select
//         value={selectedChatId || ''}
//         onChange={(e) => {
//           console.log('Selected Telegram Chat ID:', e.target.value); // 👈 Debug log to verify selection
//           onSelectChat(e.target.value);
//         }}
//         className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-medium text-[#022036] bg-slate-50 shadow-2xs cursor-pointer"
//       >
//         <option value="">-- Don't send Telegram receipt --</option>
//         {chats.map((chat) => (
//           <option key={chat.chatId} value={chat.chatId}>
//             📱 {chat.name || 'Customer'} (Last msg: "{chat.lastMessage}")
//           </option>
//         ))}
//       </select>
      
//       <p className="text-[9px] text-slate-400">
//         {chats.length === 0 
//           ? "⚠️ No chats found yet. Send a message to @meretpos_bot first!" 
//           : `✅ Connected! ${chats.length} active customer(s) ready.`}
//       </p>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { apiClient } from '../api/axiosConfig'; // 👈 Use your preconfigured Axios instance
import { Send } from 'lucide-react';

export default function TelegramReceiptSelector({ selectedChatId, onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecentChats = async () => {
    try {
      setLoading(true);
      // Uses the base URL configured in axiosConfig.js (automatically handles production vs development)
      const res = await apiClient.get('/telegram/recent-chats');
      setChats(res.data.chats || []);
    } catch (err) {
      console.error('Failed to fetch Telegram chats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentChats();
    const interval = setInterval(fetchRecentChats, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Send className="h-3 w-3 text-sky-600" /> Send Digital Receipt via Telegram
        </span>
        <button 
          type="button" 
          onClick={fetchRecentChats} 
          className="text-[9px] text-sky-600 hover:underline cursor-pointer"
        >
          {loading ? 'Refreshing...' : 'Refresh Chats'}
        </button>
      </label>

      <select
        value={selectedChatId || ''}
        onChange={(e) => {
          console.log('Selected Telegram Chat ID:', e.target.value);
          onSelectChat(e.target.value);
        }}
        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-medium text-[#022036] bg-slate-50 shadow-2xs cursor-pointer"
      >
        <option value="">-- Don't send Telegram receipt --</option>
        {chats.map((chat) => (
          <option key={chat.chatId} value={chat.chatId}>
            📱 {chat.name || 'Customer'} (Last msg: "{chat.lastMessage}")
          </option>
        ))}
      </select>
      
      <p className="text-[9px] text-slate-400">
        {chats.length === 0 
          ? "⚠️ No chats found yet. Send a message to @meretpos_bot first!" 
          : `✅ Connected! ${chats.length} active customer(s) ready.`}
      </p>
    </div>
  );
}