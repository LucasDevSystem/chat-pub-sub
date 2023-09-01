import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Card, CardHeader, Divider } from "@mui/material";

import styles from "./styles";
import { Channel } from ".";

interface InboxListProps {
  channels: Channel[];
  activeChannel: Channel | undefined;
  userId: String;
  onSelect: (id: number) => void;
}

const InboxList = ({
  channels,
  onSelect,
  activeChannel,
  userId,
}: InboxListProps) => (
  <Card sx={styles.inboxContainner}>
    <CardHeader title={userId || "lucas"} />
    <Divider />
    <List sx={styles.inboxContent}>
      {channels.map(({ img_url, title, id }: Channel) => (
        <div key={id}>
          <ListItem
            style={{
              backgroundColor: activeChannel?.id === id ? "#f0f2f5" : undefined,
            }}
            onClick={(e) => onSelect(id)}
          >
            <ListItemAvatar>
              <Avatar src={img_url} />
            </ListItemAvatar>
            <ListItemText primary={title} secondary="21 Ago, 2023" />
          </ListItem>
          <Divider variant="middle" />
        </div>
      ))}
    </List>
  </Card>
);

export default InboxList;
