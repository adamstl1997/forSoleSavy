import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
    /*listItem: {
        marginTop: 10,
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        width: '100%'
    },
    listItemText: {
        fontSize: 18
    },*/
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
    searchBarText: {
        backgroundColor: 'white',
        //paddingHorizontal: 140,
        //padding: 5,
        //marginVertical: 10,
        borderRadius: 20,
        height: 30,
        width: 335,
        overflow: 'hidden',
        alignSelf: 'center',
        marginTop: 17,
        paddingLeft: 16,
    },
    separator: {
        height: 1,
        width: 360,
        backgroundColor: "#767676",
        //marginLeft: "14%"
    },
})