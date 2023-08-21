import * as React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import styles from "./styles";
import { Channel, Message } from ".";
const MessageCard = Card;

interface MessagesViewProps {
  messages: Message[] | undefined;
  userId: string;
  activeChannel: Channel | undefined;
  onSend: (msg: string) => void;
}

const MessagesView = ({
  messages,
  onSend,
  userId,
  activeChannel,
}: MessagesViewProps) => (
  <MessageCard sx={styles.messageCard}>
    <MessageHeader title={activeChannel?.title} />
    <MessageContent userId={userId} messages={messages} />
    <MessageInput onSend={onSend} />
  </MessageCard>
);

export default MessagesView;

const MessageHeader = ({ title }: any) => (
  <>
    <CardHeader title={title} />
    <Divider></Divider>
  </>
);

const MessageContent = ({ messages = [], userId }: any) => (
  <List style={styles.messageContent}>
    <CardContent>
      {messages.map((msg: any, index: number) => (
        <InternalText
          key={index + userId}
          isSentByViewer={isSentByViewer(msg, userId || "lucas")}
          data={msg}
        />
      ))}
    </CardContent>
  </List>
);

const InternalText = ({ isSentByViewer, data }: any) => (
  <div
    style={{
      display: "flex",
      justifyContent: isSentByViewer ? "flex-end" : "flex-right",
    }}
  >
    <div
      style={{
        marginTop: 5,
        fontSize: 16,
        padding: 4,
        borderRadius: 10,
        backgroundColor: "#D3D3D3",
      }}
    >
      {!isSentByViewer && (
        <Typography
          style={{
            right: 0,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {data.senderId}
        </Typography>
      )}
      <Typography>{data.message}</Typography>
    </div>
  </div>
);

const MessageInput = ({ onSend }: any) => {
  const [text, setText] = React.useState("");
  return (
    <CardActions sx={styles.cardActions}>
      <TextField
        sx={{ width: "90%" }}
        id="outlined-uncontrolled"
        placeholder=""
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <IconButton
        onClick={() => {
          setText("");
          onSend(text);
        }}
      >
        <SendIcon></SendIcon>
      </IconButton>
    </CardActions>
  );
};

function isSentByViewer(msg: any, viewerId: any) {
  if (msg.senderId === viewerId) {
    return true;
  }
  return false;
}
