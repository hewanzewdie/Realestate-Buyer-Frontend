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
  updateDoc
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

/**
 * Get or create a chat between buyer and seller for a property
 */
export async function getOrCreateChat(
  buyerId: string,
  sellerId: string,
  propertyId: string
): Promise<string> {
  // Always treat the pair as sorted to avoid duplicates
const chatId = `${propertyId}_${buyerId}_${sellerId}`
  // Deterministic document ID = no duplicates possible
  const chatRef = doc(db, "chats", chatId);

  const chatSnap = await getDoc(chatRef);

  if (chatSnap.exists()) {
    return chatRef.id; // Already exists → return it
  }

  // Create it exactly once
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

/**
 * Send a message to a chat
 */
export async function sendMessage(
  chatId: string,
  text: string,
  senderId: string,
  receiverId: string
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

  // Update chat's last message and updatedAt
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text.trim(),
    lastMessageTime: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

/**
 * Get all chats for a user (buyer or seller)
 */
export async function getUserChats(userId: string): Promise<Chat[]> {
  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("buyerId", "==", userId)
  );

  const querySnapshot = await getDocs(q);
  const buyerChats = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Chat));

  const sellerQ = query(
    chatsRef,
    where("sellerId", "==", userId)
  );
  const sellerQuerySnapshot = await getDocs(sellerQ);
  const sellerChats = sellerQuerySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Chat));

  // Combine and sort by updatedAt
  const allChats = [...buyerChats, ...sellerChats];
  return allChats.sort((a, b) => {
    const aTime = a.updatedAt?.toMillis() || 0;
    const bTime = b.updatedAt?.toMillis() || 0;
    return bTime - aTime;
  });
}

/**
 * Listen to messages in a chat (real-time updates)
 */
export function subscribeToMessages(
  chatId: string,
  callback: (messages: ChatMessage[]) => void
): () => void {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ChatMessage));
    callback(messages);
  });
}

/**
 * Listen to user's chats (real-time updates)
 */
export function subscribeToUserChats(
  userId: string,
  callback: (chats: Chat[]) => void
): () => void {
  const chatsRef = collection(db, "chats");
  
  // We need to listen to both buyer and seller chats
  // Firestore doesn't support OR queries, so we'll listen to all chats and filter
  const q = query(chatsRef, orderBy("updatedAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const allChats: Chat[] = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Chat))
      .filter(chat => chat.buyerId === userId || chat.sellerId === userId);
    
    callback(allChats);
  });
}

/**
 * Get a single chat by ID
 */
export async function getChat(chatId: string): Promise<Chat | null> {
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);
  
  if (!chatSnap.exists()) {
    return null;
  }

  return {
    id: chatSnap.id,
    ...chatSnap.data()
  } as Chat;
}

