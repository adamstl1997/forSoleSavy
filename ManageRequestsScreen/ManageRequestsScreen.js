import React, { useState, useEffect } from 'react'
import { Image, Text, View, FlatList} from 'react-native';
import styles from './styles'
import { firebase } from '../../../src/firebase/config';
import { Card, ListItem, Button, Icon, Badge, withBadge } from 'react-native-elements';

export default function ManageRequestsScreen({navigation}) {

    const [requestedSongsArray, setArray] = useState([])

    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        let initState = true
        let tempArray
        let observer
        let currentUser = ""
        let user = firebase.auth().currentUser
        currentUser = user.uid
        const doc = firebase.firestore().collection('Users').doc(currentUser).collection('ReceivedRequests')
            observer = doc.onSnapshot(snapshot => {
                    if (snapshot.size) { //check if the snapshot has any data before proceeding
                        let myDataArray = []
                        snapshot.docChanges().forEach(change => {
                            if (change.type === 'added') { //checking for type of change. I only care about added stuff for now. Do other cases later.
                                myDataArray.push({ ...change.doc.data() })
                            }
                            if (change.type === 'modified') { //This section updates the appropriate songs number of likes on the user's end if it sees a change to it on the database side
                                let index = tempArray.findIndex(obj => obj.id === change.doc.data().id) //This finds index of which song was changed
                                tempArray[index].likes = change.doc.data().likes
                                tempArray[index].dislikes = change.doc.data().dislikes
                                setArray(
                                    tempArray.map((todo, i) =>
                                        i == index ? { ...todo, likes: change.doc.data().likes, dislikes: change.doc.data().dislikes } : todo
                                    )
                                )
                            }
                        })
                        if (initState) { //during initial state of snapshot it has all items in the database so check for this first
                            tempArray = myDataArray
                            setArray(...requestedSongsArray, myDataArray) //requestedSongsArray used to populate list
                            initState = false
                        }
                        else { //if this is another read of snapshot after first there will only be single additions to database.
                                //push new addition to end of array
                            if (myDataArray.length) {
                                const newStateData = [...tempArray, myDataArray[0]]
                                tempArray = newStateData
                                setArray(newStateData)
                            }
                        }
                    }
                    else {
                        console.log('snapshot empty')
                    }
            })
            return () => {
                //unsubscribe from listener
                if (observer) {
                    console.log('unsubcribing . . .')
                    observer()
                }
            }
    }, [])
       
    return (
        <View style={styles.container}>
            <FlatList
                data={requestedSongsArray}
                keyExtractor={item => item.id}
                extraData={refresh} //extradata to update screen when new data comes in
                renderItem={({ item }) => (
                    <Card
                        title={null}
                        containerStyle={ styles.songList }>
                        <Card.Divider/>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Image
                                    style={{width: 50, height: 50, alignSelf: 'center', marginLeft: 12}}
                                    source={{
                                        uri: item.songArt
                                    }}
                                />
                                <Text 
                                    style={{color: 'white', marginBottom: 10, fontSize: 12, marginLeft: 12}}>
                                    {item.song}{"\n"}{item.artist}{"\n"}{"\n"}{"BPM: " + item.tempo}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
                                    <Icon 
                                        name='thumb-up' 
                                        type='MaterialIcons' 
                                        color={'white'} 
                                        size={15} 
                                        iconStyle={{marginRight: 15}}
                                    />
                                    <Icon 
                                        name='thumb-down' 
                                        type='MaterialIcons' 
                                        color={'white'}   
                                        size={15} 
                                        iconStyle={{marginRight: 15}}
                                    />
                                </View>
                                <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
                                    <Text
                                        style={{color: 'white', fontSize: 12, marginRight: 25}}>{item.likes}</Text>
                                    <Text
                                        style={{color: 'white', fontSize: 12, marginRight: 25}}>{item.dislikes}</Text>
                                </View> 
                            </View>
                        </View>
                    </Card>
                )}
            />
        </View>
    )
}