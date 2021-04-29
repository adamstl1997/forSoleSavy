import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: 'center',
        backgroundColor: '#3B3C44'
    },
    container2: {
        flex: 1,
        alignItems: 'flex-start',
        backgroundColor: '#3B3C44'
    },
    title: {
        alignSelf: 'flex-start',
        left: 30,
        color: 'white',
        fontSize: 42,
        fontWeight: "bold"
    },
    listItem: {
        marginTop: 10,
        padding: 12,
        paddingVertical: 20,
        paddingHorizontal: 20,
        //alignItems: 'center',
        //backgroundColor: 'white',
        flexDirection: 'row',
        width: 300,
    },
    songList: {
        borderWidth: 0, // Remove Border
        shadowColor: 'rgba(0,0,0, 0.0)', // Remove Shadow IOS
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0, // This is for Android
        padding: 0, 
        width: Dimensions.get('window').width, 
        height: 80,
        backgroundColor: '#3B3C44',
        marginLeft: 0,
    },
    listItemText: {
        fontSize: 16,
        fontWeight: '400',
        color: 'white'
    },
    searchBar: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 10,
        borderRadius: 20
    },
    searchBarContainer: {
        backgroundColor: '#3B3C44',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    searchBarInputContainer: {
        backgroundColor: 'white',
        //paddingHorizontal: 140,
        //padding: 5,
        //marginVertical: 10,
        //borderRadius: 20,
        //height: 30,
        //width: 335,
        //overflow: 'hidden',
        //alignSelf: 'center',
        //marginTop: 17,
        //paddingLeft: 16,
    },
    separator: {
        height: 1,
        width: 360,
        backgroundColor: "#767676",
        //marginLeft: "14%"
    },
})