import React, { useState, useEffect } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, FlatList} from 'react-native';
import styles from './styles'
import spotifySearch from '../../../api/spotifySearch';
import spotifySearch_Features from '../../../api/spotifySearch_Features';
import { offsetKey, queryKey, tokenKey, currentDJKey } from '../../../Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../../../src/firebase/config';
import { useIsFocused } from '@react-navigation/native';

export default function RequestScreen({route, navigation}) {

    const [query, setQuery] = useState('');
    
    const [searchResults, setResults] = useState([])

    const [currentDJ_id, setcurrentDJ_id] = useState('')

    const isFocused = useIsFocused()

    //function for when search occurs (user typing into search bar)
    const handleSearch = async (query) => {
        setQuery(query) //set the query value
        await AsyncStorage.setItem(queryKey, query) //use local storage so I can access query value in later function
        //console.log('the value to search is', query)
    }

    const setDJ_id = async () => {
        const value = await AsyncStorage.getItem(currentDJKey);
        if (value != null) {
            setcurrentDJ_id(value)
        }
        else {
            console.log('async storage is empty')
        }
    }

    //once press happens, appropriate data sent to database
    const handlePress = async (item) => {
        const tokenValue = await AsyncStorage.getItem(tokenKey) //token needed for spotify API

        //get audio features for a track from spotify api, using to get tempo value
        const tempoValue = await spotifySearch_Features({
            id: item.id, 
            token: tokenValue
        }) //spotify api call to get the tempo value

        let currentUser = ""
        let user = firebase.auth().currentUser

        if (user) {
            currentUser = user.uid
            //console.log('Currently signed in user is: ', currentUser)
        }
        else {
            console.log('no user signed in. something is wrong')
        }
       
        //console.log('adding to database. . .')
        const RequestAdd = await firebase.firestore().collection('Users').doc(currentUser).collection('SentRequests').add({
            sentTo: currentDJ_id}); //add selected list item to database (SentRequests)

        const ReceivedAdd = firebase.firestore().collection('Users').doc(currentDJ_id).collection('ReceivedRequests').doc()
        const docID = ReceivedAdd.id
        await ReceivedAdd.set({
            sentFrom: currentUser,
            song: item.title,
            artist: item.artist,
            songArt: item.imageUri,
            id: docID,
            likes: 0,
            dislikes: 0,
            tempo: tempoValue
        }) //add selected list item to database (ReceivedRequests)

        //console.log('Added document to SentRequests with ID: ', RequestAdd.id)
        //console.log('Added document to ReceivedRequests with ID: ', ReceivedAdd.id)
        navigation.navigate('EventPage')
        alert('You requested: ' + item.title)
    }

    const searchQuery = async () => {
        try {
            const offsetValue = await AsyncStorage.getItem(offsetKey)
            const queryValue = await AsyncStorage.getItem(queryKey)
            const tokenValue = await AsyncStorage.getItem(tokenKey)
            //console.log('offset saved: ', offsetValue)
            //console.log('query saved: ', queryValue)
            //console.log('token saved: ', tokenValue)
            const newItems = await spotifySearch({
                offset: offsetValue,
                limit: 20,
                q: queryValue,
                token: tokenValue
            })
            setResults(newItems)
            //console.log('the items returned are \n', newItems)
            //console.log('Search completed')
        } catch (e) {
            console.log('Failed search query', e)
        }
    }
    
    useEffect(() => {
        //readData()
        searchQuery()
    }, [query])

    useEffect(() => {
        console.log('setting DJ ID')
        setDJ_id()
    }, [isFocused])

    return (
        <View style={styles.container}>
            <TextInput
                    style={styles.searchBarText}
                    placeholder='Search for songs'
                    //onChangeText={(text) => { setQuery(text); handleSearch(); }}
                    onChangeText={(text) => handleSearch(text)}
                    value={query}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"/>
            <FlatList
                data={searchResults}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.container2}>
                        <TouchableOpacity 
                            style={styles.listItem}
                            onPress={() => handlePress(item)}>
                            <Text style={styles.listItemText}>{item.artist} - {item.title}</Text>
                        </TouchableOpacity>
                        <View 
                        style={styles.separator}
                        />
                    </View>
                )}
            />
        </View>
    )
}