import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CircleUser,
  SendHorizonalIcon,
  BedIcon,
  BathIcon,
  Ruler,
  X,
  Menu,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import {
  getOrCreateChat,
  sendMessage,
  subscribeToMessages,
  subscribeToUserChats,
  type Chat,
  type ChatMessage,
} from "@/services/chatService";
import type { Property } from "@/types/property";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatListItem {
  chatId: string;
  otherUserName: string;
  otherUserId: string;
  topMessage: string;
  time: string;
  lastTimestamp: number;
  propertyId: string;
}

export default function Messages() {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const sellerId = searchParams.get("sellerId");
  
  const user = getAuth().currentUser;
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<Property | null>(null);
  const [otherUserName, setOtherUserName] = useState<string>("");
  const [hasInitialized, setHasInitialized] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    if (!user || !propertyId || !sellerId || hasInitialized) {
      if (!user || !propertyId || !sellerId) {
        setLoading(false);
      }
      return;
    }

    const existingChat = chats.find(
      (chat) =>
        chat.buyerId === user.uid &&
        chat.sellerId === sellerId &&
        chat.propertyId === propertyId
    );

    if (existingChat) {
      setSelectedChatId(existingChat.id);
      setHasInitialized(true);
      setLoading(false);
    }
  }, [chats, user, propertyId, sellerId, hasInitialized]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!user || !propertyId || !sellerId || hasInitialized) {
        if (!user || !propertyId || !sellerId) {
          setLoading(false);
        }
        return;
      }

      const existingChat = chats.find(
        (chat) =>
          chat.buyerId === user.uid &&
          chat.sellerId === sellerId &&
          chat.propertyId === propertyId
      );

      if (existingChat) {
        setSelectedChatId(existingChat.id);
        setHasInitialized(true);
        setLoading(false);
        return;
      }

      try {
        const chatId = await getOrCreateChat(user.uid, sellerId, propertyId);
        setSelectedChatId(chatId);
        setHasInitialized(true);

        const api = import.meta.env.VITE_API_URL;
        const propertyResponse = await fetch(`${api}/properties/${propertyId}`);
        if (propertyResponse.ok) {
          const propertyData = await propertyResponse.json();
          setProperty(propertyData);
        }

        const otherUserDoc = await getDoc(doc(db, "users", sellerId));
        if (otherUserDoc.exists()) {
          const otherUserData = otherUserDoc.data();
          setOtherUserName(otherUserData.name || "User");
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Failed to initialize chat");
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [user, propertyId, sellerId, hasInitialized, chats]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserChats(user.uid, async (updatedChats) => {
      setChats(updatedChats);

      const chatListItems: ChatListItem[] = await Promise.all(
        updatedChats.map(async (chat) => {
          const otherUserId =
            chat.buyerId === user.uid ? chat.sellerId : chat.buyerId;
          const otherUserDoc = await getDoc(doc(db, "users", otherUserId));
          const otherUserData = otherUserDoc.exists()
            ? otherUserDoc.data()
            : null;
          const name = otherUserData?.name || "User";

          const lastMessageTime = chat.lastMessageTime?.toMillis() || 0;
          const date = new Date(lastMessageTime);
          const hours = date.getHours() % 12 || 12;
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const ampm = date.getHours() >= 12 ? "PM" : "AM";
          const timeString = lastMessageTime
            ? `${hours}:${minutes} ${ampm}`
            : "";

          return {
            chatId: chat.id,
            otherUserName: name,
            otherUserId,
            topMessage: chat.lastMessage || "No messages yet",
            time: timeString,
            lastTimestamp: lastMessageTime,
            propertyId: chat.propertyId,
          };
        })
      );

      setChatList(chatListItems);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!selectedChatId) {
      setCurrentMessages([]);
      return;
    }

    const selectedChat = chats.find((c) => c.id === selectedChatId);
    if (selectedChat) {
      const otherUserId =
        selectedChat.buyerId === user?.uid
          ? selectedChat.sellerId
          : selectedChat.buyerId;
      getDoc(doc(db, "users", otherUserId)).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setOtherUserName(userData.name || "User");
        }
      });

      if (selectedChat.propertyId) {
        const api = import.meta.env.VITE_API_URL;
        fetch(`${api}/properties/${selectedChat.propertyId}`)
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error("Failed to fetch property");
          })
          .then((data) => setProperty(data))
          .catch((error) => {
            console.error("Error fetching property:", error);
          });
      }
    }

    const unsubscribe = subscribeToMessages(selectedChatId, (messages) => {
      setCurrentMessages(messages);
    });

    return () => unsubscribe();
  }, [selectedChatId, chats, user]);

  const handleSendMessage = async () => {
    if (!selectedChatId || !newMessage.trim() || !user) return;

    try {
      const selectedChat = chats.find((c) => c.id === selectedChatId);
      if (!selectedChat) return;

      const receiverId =
        selectedChat.buyerId === user.uid
          ? selectedChat.sellerId
          : selectedChat.buyerId;

      await sendMessage(selectedChatId, newMessage, user.uid, receiverId);
    setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleChatSelect = async (chatId: string) => {
    setSelectedChatId(chatId);
  };
  if (loading) {
    return (
      <div className="w-full flex p-10 h-screen space-x-10">
        <div className="flex flex-col w-1/2 space-y-10">
          {Array.from({length:5}).map((_, index)=>(
            <div key={index} className="flex w-full h-10"><Skeleton className="w-10 rounded-full"/>
          <div className="flex flex-col space-y-2"><Skeleton className="w-20 h-5"/>
          <Skeleton className="w-100 h-5"/></div></div>
          ))}
        </div>
        <Skeleton className="w-full hidden md:flex"/>
      </div>
    );
  }

  const priceText = property
    ? property.forSale
      ? `$${property.salePrice || 0}`
      : `$${property.rentPrice || 0}/month`
    : "";

  return (
    <div className="flex w-full gap-3 p-5 h-screen">
  <div
    className={`flex flex-col space-y-2 p-2 ${
      selectedChatId ? "hidden md:flex" : "flex"
    } ${property && !sidebarOpen ? "md:w-[47.5%] w-full" : !property ? "w-1/2" : "md:w-1/3 w-full"}`}
  >
    <p className="font-semibold">Messages</p>

    {chatList.length === 0 ? (
      <p className="text-sm text-gray-500 mt-4">No chats yet</p>
    ) : (
      chatList.map((item) => (
        <div
          key={item.chatId}
          onClick={() => handleChatSelect(item.chatId)}
          className="flex space-x-3 border p-2 cursor-pointer hover:bg-gray-100 rounded-md"
        >
          <CircleUser height={30} width={30} />
          <div className="flex flex-col flex-1">
            <div className="flex justify-between">
              <p className="font-medium">{item.otherUserName}</p>
              <p className="text-xs text-gray-500">{item.time}</p>
            </div>
            <p className="text-sm text-gray-600 truncate max-w-[200px]">
              {item.topMessage}
            </p>
          </div>
        </div>
      ))
    )}
  </div>

  <div
    className={`bg-gray-100 flex flex-col space-y-4 p-2 flex-1 ${
      selectedChatId ? "flex" : "hidden md:flex"
    } ${property && !sidebarOpen ? "md:w-[47.5%]" : !property ? "w-1/2" : "md:w-1/3"}`}
  >
    <Button
      className="md:hidden bg-white text-[#1bada2] font-semibold mb-2 border border-[#1bada2] w-20 text-center rounded-sm hover:bg-[#1bada2] hover:text-white transition-colors"
      onClick={() => setSelectedChatId(null)}
    >
      <ArrowLeft/>Back
    </Button>

    {selectedChatId && (
      <>
        <div className="flex items-center space-x-2">
          <CircleUser height={50} width={50} />
          <p className="font-medium">{otherUserName || "User"}</p>
        </div>
        <hr className="mt-2" />
      </>
    )}

    <div className="flex flex-col overflow-y-auto space-y-3 flex-1">
      {currentMessages.map((msg) => {
        const isMe = msg.senderId === user?.uid;
        return (
          <div
            key={msg.id}
            className={`max-w-[70%] ${isMe ? "self-end" : "self-start"}`}
          >
            <p
              className={`rounded-lg p-2 ${
                isMe ? "bg-[#1bada2] text-white" : "bg-white"
              }`}
            >
              {msg.text}
            </p>
            <p
              className={`text-xs text-gray-500 mt-1 ${
                isMe ? "text-end" : "text-start"
              }`}
            >
              {msg.time}
            </p>
          </div>
        );
      })}
    </div>

    {selectedChatId && (
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

  {property && (
    <div className={`hidden md:flex flex-col ${sidebarOpen ? "w-1/3" : "w-10 h-16 border-0 shadow-none"} border p-3 rounded-lg shadow-md`}>
      {sidebarOpen ? (
        <>
          <X
            className="self-end cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
          <p className="font-semibold">Details</p>

          <div className="grid grid-cols-4 grid-rows-2 w-full h-86 mb-5 gap-2">
            <div className="bg-green-400 col-start-1 col-end-3 row-start-1 row-end-3"><img src="https://images.unsplash.com/photo-1649083048428-3d8ed23a3ce0?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D" alt="" className="h-full" /></div>
        <div className="bg-yellow-400 col-start-3 col-end-5 row-start-1 row-end-2"><img src="https://images.unsplash.com/photo-1615873968403-89e068629265?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D" alt="" className="w-full h-full" /></div>
        <div className="bg-red-400 col-start-3 col-end-4 row-start-2 row-end-3"><img src="https://images.unsplash.com/photo-1649083048337-4aeb6dda80bb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG91c2UlMjBpbnRlcmlvcnxlbnwwfHwwfHx8MA%3D%3D" alt="" className="h-full" /></div>
        <div className="bg-blue-400 col-start-4 col-end-5 row-start-2 row-end-3"><img src="https://images.unsplash.com/photo-1616593918824-4fef16054381?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhvdXNlJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D" alt="" className="h-full w-full" /></div>
          </div>

          <p className="font-medium">{property.title}</p>

          <div className="flex justify-between">
            <div className="flex space-x-2 mb-2">
              <button className="border border-[#1bada2] text-[#1bada2] px-2 py-1 rounded-lg text-sm flex items-center">
                <BedIcon className="w-4 h-4 mr-1" /> {property.bedrooms || 0} Beds
              </button>
              <button className="border border-[#1bada2] text-[#1bada2] px-2 py-1 rounded-lg text-sm flex items-center">
                <BathIcon className="w-4 h-4 mr-1" /> {property.bathrooms || 0} Baths
              </button>
              <button className="border border-[#1bada2] text-[#1bada2] px-2 py-1 rounded-lg text-sm flex items-center">
                <Ruler className="w-4 h-4 mr-1" /> {property.area || 0} sqft
              </button>
            </div>
            <button className="border border-[#1bada2] text-[#1bada2] px-2 py-1 mb-2 rounded-lg text-sm">
              {property.forRent ? "For Rent" : "For Sale"}
            </button>
          </div>

          <div className="flex justify-between">
            <p className="text-sm text-gray-600 mb-2">
              {property.description || "No description available"}
            </p>
            <p className="text-xl font-bold text-red-500 ml-2">{priceText}</p>
          </div>
        </>
      ) : (
        <Menu
          className="self-end cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        />
      )}
    </div>
  )}
</div>
  );
}
