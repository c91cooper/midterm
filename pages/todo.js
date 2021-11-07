import React, { useState, useEffect } from 'react'
import {
    Flex,
    Heading,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Text,
    IconButton,
    Divider,
    Link,
} from "@chakra-ui/react"
import DarkModeSwitch from '../components/DarkModeSwitch'
import {
    useAuthUser,
    withAuthUser,
    withAuthUserTokenSSR,
    AuthAction,
} from 'next-firebase-auth'
import getAbsoluteURL from '../utils/getAbsoluteURL'
import { AddIcon, DeleteIcon, StarIcon } from "@chakra-ui/icons"
import firebase from 'firebase/app'
import 'firebase/firestore'

const Todos = () => {
    const AuthUser = useAuthUser()
    const [input, setInput] = useState('')
    const [todos, setTodos] = useState([])


    useEffect(() => {
        AuthUser.id &&
            firebase
                .firestore()
                .collection("todo")
                .where('user', '==', AuthUser.id)
                .onSnapshot(snapshot => {
                    setTodos(snapshot.docs.map(doc => {
                      return{
                        todoID: doc.id,
                        todo: doc.data().todo
                      }
                })
                    );
                })
    })

    const sendData = () => {
        try {
            firebase
                .firestore()
                .collection("todo") 
                .add({
                    todo: input,
                    //timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    user: AuthUser.id
                })
                .then(console.log('Data was successfully sent to cloud firestore!'));
                setInput('');
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTodo = (t) => {
        try {
            firebase
                .firestore()
                .collection("todo")
                .doc(t)
                .delete()
                .then(console.log('Data was successfully deleted!'))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Flex flexDir="column" maxW={800} align="center" justify="center" minH="100vh" m="auto" px={4}>
            <Flex justify="space-between" w="100%" align="center">
                <Heading mb={4}>Welcome, {AuthUser.email}!</Heading>
                <Flex>
                    <DarkModeSwitch />
                    <IconButton ml={2} onClick={AuthUser.signOut} icon={<StarIcon />} />
                </Flex>
            </Flex>

            <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    children={<AddIcon color="gray.300" />}
                />
                <Input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Todo Item" />
                <Button
                    ml={2}
                    onClick={() => sendData()}
                >
                    Add Item
                </Button>
            </InputGroup>

            {todos.map((item, i) => {
                return (
                    <React.Fragment key={i}>
                        {i > 0 && <Divider />}
                        <Flex
                            w="100%"
                            p={5}
                            my={2}
                            align="center"
                            borderRadius={5}
                            justifyContent="space-between"
                        >
                            <Flex align="center">
                                <Text fontSize="xl" mr={4}>{i + 1}.</Text>
                                <Text><Link href= {'/todos/' + item.todoID}>{item.todo}</Link></Text>
                            </Flex>
                            <IconButton onClick={() => deleteContact(item.contactID)} icon={<DeleteIcon />} />
                        </Flex>
                    </React.Fragment>
                )
            })}
        </Flex>
    )
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
    return {
        props: {
        }
    }
})

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
})(Todos)
