import { useState } from "react";
import { CircleUser, X, BedIcon, BathIcon, Ruler, SendHorizonalIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarHeader,
// } from "@/components/ui/sidebar";

export default function Messages() {
    const chatList = [
    {
      senderName: "Jane Doe",
      topMessage:
        "What I am more concerned about is the amenities. Yes, are pets allowed?",
      timeAgo: "2 days ago",
    },
    {
      senderName: "John Smith",
      topMessage:
        "Hello! I wanted to follow up on our previous conversation about the property.",
      timeAgo: "5 days ago",
    },
  ];

const [chatHistory, setChatHistory] = useState<
    Record<string, { text: string; time: string; isMe: boolean }[]>
  >({
    "Jane Doe": [
      { text: "hello", time: "10:45 AM", isMe: false },
      { text: "bye", time: "10:47 AM", isMe: true },
      { text: "Are pets allowed?", time: "10:50 AM", isMe: false },
      { text: "Yes, small pets are fine!", time: "10:52 AM", isMe: true },
    ],
    "John Smith": [
      { text: "Hi there!", time: "09:12 AM", isMe: false },
      { text: "Any updates on the price?", time: "09:15 AM", isMe: false },
    ],
  });


  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const currentMessages = selectedChat ? chatHistory[selectedChat] || [] : [];

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-3 p-5">
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
            className="flex space-x-3 border p-1 cursor-pointer hover:bg-gray-100"
          >
            <CircleUser height={30} width={30} />
            <div className="flex flex-col flex-1">
              <div className="flex justify-between">
                <p className="font-medium">{item.senderName}</p>
                <p className="text-xs text-gray-500 ">{item.timeAgo}</p>
              </div>
              <p className="text-sm text-gray-600 ">
                {item.topMessage}
              </p>
            </div>
          </div>
        ))}
      </div>

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
          <hr className="mt-2"/>
          </div>
        )}

        <p className={`self-center text-sm border rounded-lg w-14 text-center ${selectedChat? "" : "hidden"}`}>
          today
        </p>

        <div className="flex flex-col overflow-y-auto space-y-3">
          {currentMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`w-1/2 ${msg.isMe ? "self-end" : "self-start"}`}
            >
              <p className="bg-green-100 rounded-lg p-1.5">{msg.text}</p>
              <p
                className={`text-sm text-gray-500 ${
                  msg.isMe ? "text-end" : "text-start"
                }`}
              >
                {msg.time}
              </p>
            </div>
          ))}
        </div>
<div className={`flex space-x-2 mt-auto mb-2 ${selectedChat ? "" : "hidden"}`}>
<Input className="bg-white border border-gray-400" placeholder="Write message..."/>
<Button className="bg-[#1bada2]"><SendHorizonalIcon/></Button>
</div>
      </div>

      {/*  Listing Detail panel */}
      <div className="hidden md:flex flex-col">
        <X className="self-end cursor-pointer"/>
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