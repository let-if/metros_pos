
// import { useState, useEffect } from 'react';
// import { apiClient } from '../api/axiosConfig'; // 👈 Use your preconfigured Axios instance
// import { Send } from 'lucide-react';

// export default function TelegramReceiptSelector({ selectedChatId, onSelectChat }) {
//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchRecentChats = async () => {
//     try {
//       setLoading(true);
//       // Uses the base URL configured in axiosConfig.js (automatically handles production vs development)
//       const res = await apiClient.get('/telegram/recent-chats');
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
//           console.log('Selected Telegram Chat ID:', e.target.value);
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
import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/axiosConfig';
import { Send, Search, Check, ChevronDown } from 'lucide-react';

export default function TelegramReceiptSelector({ selectedChatId, onSelectChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const fetchRecentChats = async () => {
    try {
      setLoading(true);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter chats based on what the cashier types
  const filteredChats = chats.filter(chat => 
    (chat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chat.lastMessage || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChat = chats.find(c => String(c.chatId) === String(selectedChatId));

  return (
    <div className="space-y-1.5 relative" ref={dropdownRef}>
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

      {/* Custom Searchable Dropdown Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-yellow-500 font-medium text-[#022036] bg-slate-50 shadow-2xs cursor-pointer flex items-center justify-between"
      >
        <span className="truncate">
          {selectedChat 
            ? `📱 ${selectedChat.name} (Msg: "${selectedChat.lastMessage}")` 
            : "-- Don't send Telegram receipt --"}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-2" />
      </div>

      {/* Dropdown Menu with Search */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full bg-transparent text-xs outline-none text-[#022036]"
            />
          </div>

          <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
            <div
              onClick={() => {
                onSelectChat('');
                setIsOpen(false);
                setSearchTerm('');
              }}
              className="px-3.5 py-2.5 text-xs text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
            >
              <span>-- Don't send Telegram receipt --</span>
              {!selectedChatId && <Check className="h-3.5 w-3.5 text-yellow-500" />}
            </div>

            {filteredChats.length === 0 ? (
              <div className="px-3.5 py-4 text-center text-xs text-slate-400">
                No matching customer found
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.chatId}
                  onClick={() => {
                    onSelectChat(chat.chatId);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`px-3.5 py-2.5 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    String(selectedChatId) === String(chat.chatId) ? 'bg-yellow-50/80 font-bold text-[#022036]' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="truncate">📱 {chat.name || 'Customer'}</p>
                    <p className="text-[10px] text-slate-400 truncate">Last: "{chat.lastMessage}"</p>
                  </div>
                  {String(selectedChatId) === String(chat.chatId) && (
                    <Check className="h-3.5 w-3.5 text-yellow-600 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      <p className="text-[9px] text-slate-400">
        {chats.length === 0 
          ? "⚠️ No chats found yet. Send a message to @meretpos_bot first!" 
          : `✅ Connected! ${chats.length} active customer(s) ready.`}
      </p>
    </div>
  );
}