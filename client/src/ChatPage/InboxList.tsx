import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Card, CardHeader, Divider } from "@mui/material";
import styles from "./styles";

const InboxList = ({ recentMessages, onSelect, activeChannel }: any) => {
  return (
    <Card sx={styles.inboxContainner}>
      <CardHeader title="Lucas" />
      <Divider></Divider>
      <List sx={styles.inboxContent}>
        {recentMessages.map(({ img_url, title, id }: any) => (
          <div key={id}>
            <ListItem
              style={{
                backgroundColor:
                  activeChannel?.id === id ? "#f0f2f5" : undefined,
              }}
              onClick={(e) => onSelect(id)}
            >
              <ListItemAvatar>
                <Avatar src={img_url}></Avatar>
              </ListItemAvatar>
              <ListItemText primary={title} secondary="Ago 10, 2023" />
            </ListItem>
            <Divider variant="middle" />
          </div>
        ))}
      </List>
    </Card>
  );
};

export default InboxList;
