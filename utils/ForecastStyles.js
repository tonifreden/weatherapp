import { StyleSheet } from 'react-native';

export const forecastStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },
    subHeaderContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    subHeaderColumnLeft: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    subHeaderColumnRight: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    bodyContainer: {
        flex: 2,
        width: "70%",
    },
    windContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginTop: 20,
    },
    searchContainer: {
        flex: 7,
        marginTop: 10,
        alignItems: "center",
    },
    cityText: {
        fontSize: 48,
        color: "#fff"
    },
    tempText: {
        fontSize: 40,
        color: "#fff"
    },
    infoText: {
        fontSize: 20,
        color: "#fff"
    },
    arrow: {
        fontSize: 30,
        color: "#fff",
        marginRight: 20
    }
});