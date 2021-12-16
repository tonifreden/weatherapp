import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("history.db");

export default function HistoryScreen() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql("create table if not exists history (id integer primary key not null, city text);")
        });
        updateHistory();
    }, [history]);

    const updateHistory = () => {
        db.transaction(tx => {
            tx.executeSql("select * from history;", [], (_, { rows }) => {
                setHistory(rows._array)
            });
        });
    }

    const deleteFromHistory = (id) => {
        db.transaction(tx => {
            tx.executeSql("delete from history where id = ?;", [id]);
        }, null, updateHistory)
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
                onPress={() => deleteFromHistory(item.id)}
            />
        </ListItem>
    )

    return (
        <View style={styles.container}>
            <FlatList
                keyExtractor={keyExtractor}
                data={history}
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