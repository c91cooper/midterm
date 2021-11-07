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
    Link
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

const Events = () => {
    const AuthUser = useAuthUser()
    const [inputName, setInputName] = useState('')
    const [inputDate, setInputDate] = useState('')
    const [events, setEvents] = useState([])


    useEffect(() => {
        AuthUser.id &&
            firebase
                .firestore()
                .collection("events")
                .where('user', '==', AuthUser.id)
                .onSnapshot(snapshot => {
                    setEvents(snapshot.docs.map(doc => {
                      return{
                        eventID: doc.id,
                        eventName: doc.data().name,
                        eventDate: doc.data().date.toDate().toDateString()
                      }
                })
                    );
                })
    })

    const sendData = () => {
        try {
            firebase
                .firestore()
                .collection("events") 
                .add({
                    name: inputName,
                    date: firebase.firestore.Timestamp.fromDate( new Date(inputDate) ),
                    user: AuthUser.id
                })
                .then(console.log('Data was successfully sent to cloud firestore!'));
                setInputName('');
                setInputDate('');
        } catch (error) {
            console.log(error)
        }
    }

    const deleteEvent = (t) => {
        try {
            firebase
                .firestore()
                .collection("events")
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
                <Input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="Event Name" />
                <Input type="date" value={inputDate} onChange={(e) => setInputDate(e.target.value)} placeholder="Event Date" />
                <Button
                    ml={2}
                    onClick={() => sendData()}
                >
                    Add Event
                </Button>
            </InputGroup>

            {events.map((item, i) => {
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
                                <Text><Link href={'/events/' + item.eventID}>{item.eventName}</Link></Text>
                            </Flex>
                            <IconButton onClick={() => deleteEvent(item.eventID)} icon={<DeleteIcon />} />
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
})(Events)