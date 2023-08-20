import * as React from "react";
import { Box } from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";

import MessagesView from "./MessagesView";
import styles from "./styles";
import InboxList from "./InboxList";

const currentUserName = "jose";

interface Channel {
  id: number;
  title: string;
  img_url: string;
}

// canais 
const channels = [
  {
    id: 1,
    title: "if migs",
    img_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Instituto_Federal_de_Minas_Gerais_-_Marca_Vertical_2015.svg/1200px-Instituto_Federal_de_Minas_Gerais_-_Marca_Vertical_2015.svg.png",
  },
  {
    id: 2,
    title: "dead chat",
    img_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4DX4WmaVeSweK93rU-ReHOOTdGi2bPfV40PDwaD_5L8DWqYuiOmzlGkmZ2D1lYL30q84&usqp=CAU",
  },
];

const ENDPOINT_BASE_URL = `http://localhost:3003`;

const MessagesPage = () => {
  const [activeChannel, setActiveChannel] = React.useState<Channel>();
  const [messages, setMessages] = React.useState<Array<any>>([]);
  const [subscriptionActive, setSubscriptionActive] = React.useState(true);
  const [userId, setUserId] = React.useState(1);

  const handleSelect = (channelId: number) => {
    const channel: Channel | undefined = channels.find(
      (ch) => ch.id === channelId
    );
    console.log(channel);

    if (!channel) return;

    setActiveChannel(channel);
  };

  // publicador
  const publish = async (message: string) => {
    try {
      if (activeChannel?.id === undefined) return;

      await axios.post(`${ENDPOINT_BASE_URL}/publish/${activeChannel.id}`, {
        channelId: activeChannel,
        senderId: userId,
        senderName: currentUserName,
        message,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // assinante
  React.useEffect(() => {
    if (subscriptionActive && activeChannel?.id !== undefined) {
      const eventSource = new EventSource(
        ` ${ENDPOINT_BASE_URL}/subscribe/${activeChannel.id}`
      );

      eventSource.addEventListener("message", (event) => {
        const newMessage = JSON.parse(JSON.parse(event.data));
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        eventSource.close();
      };
    }
  }, [activeChannel]);

  return (
    <div>
      <Container fixed>
        <label>Usuario</label>
        <input onChange={(e: any) => setUserId(e.target.value)}></input>
        <Box sx={styles.box}>
          <InboxList
            onSelect={handleSelect}
            recentMessages={channels}
            activeChannel={activeChannel}
          />
          <div style={styles.messageContainner}>
            <MessagesView
              activeChannel={activeChannel}
              onSend={publish}
              userId={userId}
              messages={messages}
            />
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default MessagesPage;

const getMessagesByUser = (data: Array<any>, activeMessage: string) => {
  const filtered = data.filter((user) => user.userName === activeMessage);
  if (!filtered.length) {
    return [];
  }
  return filtered[0].messages;
};
