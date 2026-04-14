import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export interface Chat {
  id: string;
  buyerId: string;
  sellerId: string;
  propertyId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessage?: string;
  lastMessageTime?: Timestamp;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  createdAt: Timestamp;
  time: string;
}

export async function getOrCreateChat(
  buyerId: string,
  sellerId: string,
  propertyId: string,
): Promise<string> {
  const chatId = `${propertyId}_${buyerId}_${sellerId}`;
  const chatRef = doc(db, "chats", chatId);

  const chatSnap = await getDoc(chatRef);

  if (chatSnap.exists()) {
    return chatRef.id; 
  }

  const now = Timestamp.now();
  await setDoc(chatRef, {
    buyerId,
    sellerId,
    propertyId,
    createdAt: now,
    updatedAt: now,
  });

  return chatRef.id;
}

export async function sendMessage(
  chatId: string,
  text: string,
  senderId: string,
  receiverId: string,
): Promise<void> {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  const timeString = `${hours}:${minutes} ${ampm}`;

  const messagesRef = collection(db, "chats", chatId, "messages");
  await addDoc(messagesRef, {
    text: text.trim(),
    senderId,
    receiverId,
    createdAt: Timestamp.now(),
    time: timeString,
  });

  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text.trim(),
    lastMessageTime: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("buyerId", "==", userId));

  const querySnapshot = await getDocs(q);
  const buyerChats = querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Chat,
  );

  const sellerQ = query(chatsRef, where("sellerId", "==", userId));
  const sellerQuerySnapshot = await getDocs(sellerQ);
  const sellerChats = sellerQuerySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Chat,
  );

  const allChats = [...buyerChats, ...sellerChats];
  return allChats.sort((a, b) => {
    const aTime = a.updatedAt?.toMillis() || 0;
    const bTime = b.updatedAt?.toMillis() || 0;
    return bTime - aTime;
  });
}

export function subscribeToMessages(
  chatId: string,
  callback: (messages: ChatMessage[]) => void,
): () => void {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as ChatMessage,
    );
    callback(messages);
  });
}

export function subscribeToUserChats(
  userId: string,
  callback: (chats: Chat[]) => void,
): () => void {
  const chatsRef = collection(db, "chats");

  const q = query(chatsRef, orderBy("updatedAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const allChats: Chat[] = snapshot.docs
      .map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Chat,
      )
      .filter((chat) => chat.buyerId === userId || chat.sellerId === userId);

    callback(allChats);
  });
}

export async function getChat(chatId: string): Promise<Chat | null> {
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    return null;
  }

  return {
    id: chatSnap.id,
    ...chatSnap.data(),
  } as Chat;
}
