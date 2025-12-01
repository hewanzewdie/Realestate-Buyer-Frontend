import { useState, useMemo } from "react";
import {
  CircleUser,
  SendHorizonalIcon,
  BedIcon,
  BathIcon,
  Ruler,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarHeader,
//   SidebarFooter,
// } from "@/components/ui/sidebar";

export default function Messages() {
  const [chatHistory, setChatHistory] = useState<
    Record<string, { text: string; time: string; isMe: boolean; timestamp: number }[]>
  >({
    "Jane Doe": [
      { text: "hello", time: "10:45 AM", isMe: false, timestamp: 1 },
      { text: "bye", time: "10:47 AM", isMe: true, timestamp: 2 },
      { text: "Are pets allowed?", time: "10:50 AM", isMe: false, timestamp: 3 },
      { text: "Yes, small pets are fine!", time: "10:52 AM", isMe: true, timestamp: 4 },
    ],
    "John Smith": [
      { text: "Hi there!", time: "09:12 AM", isMe: false, timestamp: 1 },
      { text: "Any updates on the price?", time: "09:15 AM", isMe: false, timestamp: 2 },
    ],
  });

  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Compute latest messages & sort chats by most recent message
  const chatList = useMemo(() => {
    return Object.entries(chatHistory)
      .map(([name, messages]) => {
        const latest = messages[messages.length - 1];
        return {
          senderName: name,
          topMessage: latest.text,
          time: latest.time,
          lastTimestamp: latest.timestamp,
        };
      })
      .sort((a, b) => b.lastTimestamp - a.lastTimestamp);
  }, [chatHistory]);

  const currentMessages = selectedChat ? chatHistory[selectedChat] || [] : [];

  const handleSendMessage = () => {
    if (!selectedChat || !newMessage.trim()) return;

    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const timeString = `${hours}:${minutes} ${ampm}`;
    const timestamp = now.getTime();

    const newMsg = {
      text: newMessage.trim(),
      time: timeString,
      isMe: true,
      timestamp,
    };

    setChatHistory((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg],
    }));

    setNewMessage("");
  };
const [propertyDetail, setPropertyDetail] = useState(true)
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-3 p-5">
      {/* CHAT LIST */}
      <div
        className={`min-h-screen flex flex-col space-y-2 p-2 ${
          selectedChat ? "hidden md:flex" : "flex"
        }`}
      >
        <p className="font-semibold">Messages</p>

        <div className="flex space-x-5">
          <button className="border rounded-md p-1 w-16">Chats</button>
          <button>Requests</button>
        </div>

        {chatList.map((item) => (
          <div
            key={item.senderName}
            onClick={() => setSelectedChat(item.senderName)}
            className="flex space-x-3 border p-2 cursor-pointer hover:bg-gray-100 rounded-md"
          >
            <CircleUser height={30} width={30} />
            <div className="flex flex-col flex-1">
              <div className="flex justify-between">
                <p className="font-medium">{item.senderName}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
              <p className="text-sm text-gray-600 truncate max-w-[200px]">
                {item.topMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CHAT WINDOW */}
      <div
        className={`bg-gray-100 min-h-screen flex flex-col space-y-4 p-2 ${
          selectedChat ? "flex" : "hidden md:flex"
        }`}
      >
        <button
          className="md:hidden text-[#1bada2] font-semibold mb-2 border border-[#1bada2] w-20 text-center rounded-sm hover:bg-[#1bada2] hover:text-white transition-colors"
          onClick={() => setSelectedChat(null)}
        >
          ← Back
        </button>

        {selectedChat && (
          <div>
            <div className="flex space-x-2">
              <CircleUser height={50} width={50} />
              <div>
                <p className="font-medium">{selectedChat}</p>
                <p className="text-sm text-green-500">online</p>
              </div>
            </div>
            <hr className="mt-2" />
          </div>
        )}

        <p
          className={`self-center text-sm border rounded-lg w-14 text-center ${
            selectedChat ? "" : "hidden"
          }`}
        >
          today
        </p>

        {/* MESSAGES */}
        <div className="flex flex-col overflow-y-auto space-y-3 flex-1">
          {currentMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[70%] ${
                msg.isMe ? "self-end" : "self-start"
              }`}
            >
              <p
                className={`rounded-lg p-2 ${
                  msg.isMe ? "bg-[#1bada2] text-white" : "bg-white"
                }`}
              >
                {msg.text}
              </p>
              <p
                className={`text-xs text-gray-500 mt-1 ${
                  msg.isMe ? "text-end" : "text-start"
                }`}
              >
                {msg.time}
              </p>
            </div>
          ))}
        </div>

        {/* MESSAGE INPUT */}
        {selectedChat && (
          <div className="flex items-center space-x-2 mt-auto mb-2 sticky bottom-0 bg-gray-100 py-2">
            <Input
              className="bg-white border border-gray-400 flex-1"
              placeholder="Write message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <Button className="bg-[#1bada2]" onClick={handleSendMessage}>
              <SendHorizonalIcon />
            </Button>
          </div>
        )}
      </div>

      {/* PROPERTY DETAILS PANEL */}
      <div className={`hidden md:flex flex-col ${propertyDetail? 'flex': 'hidden'} border p-3 rounded-lg shadow-md`}>
        <X className="self-end cursor-pointer" onClick={()=>setPropertyDetail(false)}/>
        <p className="font-semibold">Details</p>

        <div className="grid grid-cols-4 grid-rows-2 w-full h-86 mb-5 gap-2">
          <div className="bg-green-400 col-span-2 row-span-2" />
          <div className="bg-yellow-400 col-span-2 row-span-1" />
          <div className="bg-red-400 col-span-1 row-span-1" />
          <div className="bg-blue-400 col-span-1 row-span-1" />
        </div>

        <p className="font-medium">Skyper Pool Apartment</p>

        <div className="flex justify-between">
          <div className="flex space-x-2 mb-2">
            <button className="border border-[#1bada2] text-[#1bada2] px-2 py-1 rounded-lg text-sm flex items-center">
              <BedIcon className="w-4 h-4 mr-1" /> 4 Beds
            </button>
            <button className="border border-[#1bada2] text-[#1bada2] px-2 py-1 rounded-lg text-sm flex items-center">
              <BathIcon className="w-4 h-4 mr-1" /> 2 Baths
            </button>
            <button className="border border-[#1bada2] text-[#1bada2] px-2 py-1 rounded-lg text-sm flex items-center">
              <Ruler className="w-4 h-4 mr-1" /> 450 sqft
            </button>
          </div>
          <button className="border border-[#1bada2] text-[#1bada2] px-2 py-1 mb-2 rounded-lg text-sm">
            For Sale
          </button>
        </div>

        <div className="flex justify-between">
          <p className="text-sm text-gray-600 mb-2">
            Modern 7th-floor Skyper Pool apartment for sale at $280,000.
            Includes lift, parking, pool access, and 24/7 security.
          </p>
          <p className="text-xl font-bold text-red-500 ml-2">$280,000</p>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">Location</h2>
          <div className="bg-pink-300 h-86" />
        </div>
      </div>
    </div>
  );
}
