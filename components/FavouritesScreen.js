import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("favs.db");

export default function FavouritesScreen() {
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql("create table if not exists favourite (id integer primary key not null, city text);")
        });
        updateFavourites();
    }, [favourites]);

    const updateFavourites = () => {
        db.transaction(tx => {
            tx.executeSql("select * from favourite;", [], (_, { rows }) => {
                setFavourites(rows._array)
            });
        });
    }

    const deleteFavourite = (id) => {
        db.transaction(tx => {
            tx.executeSql("delete from favourite where id = ?;", [id]);
        }, null, updateFavourites)
    }

    const keyExtractor = (item, index) => index.toString();

    const renderItem = ({ item }) => (
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title>{item.city}</ListItem.Title>
            </ListItem.Content>
            <Button
                icon={{name: "delete", color: "red", size: 30}}
                buttonStyle={{backgroundColor: "#fff"}}
                onPress={() => deleteFavourite(item.id)}
            />
        </ListItem>
    )

    return (
        <View style={styles.container}>
            <FlatList
                keyExtractor={keyExtractor}
                data={favourites}
                renderItem={renderItem}
                />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
});