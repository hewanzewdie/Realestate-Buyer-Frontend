export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  propertyId: string;
  createdAt: number; 
  chatId: string;
}
