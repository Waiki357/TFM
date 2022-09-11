export interface Message {
  senderid: string;
  receiverid: string;
  message: string;
  messagestatus: string;
  messagedate: Date;
  IsGroup: boolean;
  IsPrivate: boolean;
  IsMultiple: boolean;
}
