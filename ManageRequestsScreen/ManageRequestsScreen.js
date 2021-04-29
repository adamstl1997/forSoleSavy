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
                                //console.log('new request added: ', change.doc.data())
                                //songname = change.doc.data().song
                                //console.log(songname)
                                myDataArray.push({ ...change.doc.data() })
                            }
                        })
                        //console.log('Received doc snapshot (from ManageRequest): ', myDataArray)
                        if (initState) { //during initial state of snapshot it has all items in the database so check for this first
                            //console.log('first if')
                            tempArray = myDataArray
                            setArray(...requestedSongsArray, myDataArray) //requestedSongsArray used to populate list
                            initState = false
                        }
                        else { //if this is another read of snapshot after first there will only be single additions to database.
                                //cycle through all new additions and push to temp array.
                            //console.log('in else')
                            myDataArray.forEach((doc) => {
                                tempArray.push({ ...doc })
                            })
                            //console.log('printing temparray', tempArray)
                            //setArray(...requestedSongsArray, tempArray)
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