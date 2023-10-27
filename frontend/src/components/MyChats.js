import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Avatar, Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender, getSenderImg } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const [loggedUser,setLoggedUser]=useState()
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState()
  // console.log(chats);
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
        const { data } = await axios.get("/api/chat", config)
      setChats(data)
      // console.log(data)
     
    } catch (error) {
      toast({
        title: "Error occured!",
        status: "error",
        description: "Failed to load the chats",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats();
  },[fetchAgain])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work sans"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"white"}
        w="100%"
        h="100%"
        borderRadius={"lg"}
        overflowY={"hidden"}
        borderColor={"#0375f1"}
        borderWidth={'thin'}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#0255B1" : "#BEE3F8"}
                color={selectedChat === chat ? "white" : "black"}
                _hover={{
                  background: "#0255B1",
                  color: "white",
                }}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
                display={"flex"}
                alignItems={"center"}
              >
                <Avatar
                  name="Chat Infinite"
                  src={
                    !chat.isGroupChat
                      ? getSenderImg(loggedUser, chat.users)
                      : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                  }
                  size="sm"
                  mr={2}
                />
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats
