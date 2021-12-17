import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { weatherConditions } from '../utils/WeatherConditions';
import { Button, Icon, Input } from 'react-native-elements';
import { forecastStyles } from '../utils/ForecastStyles';
import * as SQLite from 'expo-sqlite';

const API_KEY = "814ddd8c0db86cbf68f8668a8a207107";

const UNITS = "metric";

const favsDb = SQLite.openDatabase("favs.db");
const histDb = SQLite.openDatabase("history.db");

export default function ForecastScreen() {
    const [keyword, setKeyword] = useState("helsinki");
    
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [temp, setTemp] = useState("");
    const [tempFeelsLike, setTempFeelsLike] = useState("");
    const [weatherMain, setWeatherMain] = useState("Clear");
    const [weatherDesc, setWeatherDesc] = useState("");
    const [windSpeed, setWindSpeed] = useState("");
    const [windDirection, setWindDirection] = useState("0deg");
    
    const [favourites, setFavourites] = useState([]);
    const [history, setHistory] = useState([]);
    
    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    useEffect(() => {
        favsDb.transaction(tx => {
            tx.executeSql("create table if not exists favourite (id integer primary key not null, city text);")
        });
        histDb.transaction(tx => {
            tx.executeSql("create table if not exists history (id integer primary key not null, city text);")
        });
        findByCityName();
        setKeyword("");
    }, []);

    const saveFavourite = () => {
        favsDb.transaction(tx => {
            tx.executeSql("insert into favourite (city) values (?);", [city]);
        }, null, updateFavourites);
        Alert.alert(`${city} saved to favourites!`)
    }

    const saveToHistory = () => {
        histDb.transaction(tx => {
            tx.executeSql("insert into history (city) values (?);", [city]);
        }, null, updateHistory);
    }

    const updateFavourites = () => {
        favsDb.transaction(tx => {
            tx.executeSql("select * from favourite;", [], (_, { rows }) => {
                setFavourites(rows._array)
            });
        });
    }

    const updateHistory = () => {
        histDb.transaction(tx => {
            tx.executeSql("select * from history;", [], (_, { rows }) => {
                setHistory(rows._array)
            });
        });
    }
        
    const findByCityName = () => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${keyword}&appid=${API_KEY}&units=${UNITS}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                setCity(data.name);
                setCountry(data.sys.country);
                setTemp(Math.round(data.main.temp));
                setTempFeelsLike(Math.round(data.main.feels_like));
                setWeatherMain(data.weather[0].main);
                setWeatherDesc(data.weather[0].description);
                setWindSpeed(Math.round(data.wind.speed));
                setWindDirection(`${data.wind.deg}deg`);
            } else {
                Alert.alert("No such city found")
            }
        })
        .catch(error => {
            Alert.alert("Error", error);
        });
    }

    const handleSearch = () => {
        if (keyword === "") {
            Alert.alert("City name cannot be empty!");
            return;
        }
        findByCityName();
        saveToHistory();
        setKeyword("");
    }

    return (
        <View style={[forecastStyles.container, { backgroundColor: weatherConditions[weatherMain].bgColor }]}>
            <View style={forecastStyles.headerContainer}>
                <Text style={forecastStyles.cityText}>{city}, {country}</Text>
                <Button
                        raised
                        onPress={() => saveFavourite()}
                        buttonStyle={{
                            backgroundColor: "white",
                            borderColor: "transparent",
                            borderWidth: 0,
                            borderRadius: 100,
                        }}
                        containerStyle={{
                            width: 60,
                            borderRadius: 100
                        }}
                        icon={{
                            name: "favorite",
                            type: "materialicons", 
                            color: weatherConditions[weatherMain].bgColor,
                            size: 30,
                        }}
                    />
                <View style={forecastStyles.subHeaderContainer}>
                    <View style={forecastStyles.subHeaderColumnLeft}>
                        <Icon
                            type="feather"
                            size={72}
                            name={weatherConditions[weatherMain].icon}
                            color="#fff"
                            />
                            <Text style={forecastStyles.infoText}>{capitalize(weatherDesc)}</Text>
                    </View>
                    <View style={forecastStyles.subHeaderColumnRight}>
                        <Text style={forecastStyles.tempText}>{temp} &deg;C</Text>
                        <Text style={forecastStyles.infoText}>Feels like: {tempFeelsLike} &deg;C</Text>
                    </View>
                </View>
            </View>
            <View style={forecastStyles.bodyContainer}>
                <View style={forecastStyles.windContainer}>
                    <Icon
                        type="feather"
                        size={40}
                        name="wind"
                        color="#fff"
                        style={{marginLeft: 20}}
                    />
                    <Text style={forecastStyles.infoText}>{windSpeed} m/s</Text>
                    <Text
                        style={[
                            forecastStyles.arrow,
                            { transform: [{rotate: windDirection}] }
                        ]}>
                        &#8593; {/* <-- this is an arrow */}
                    </Text>
                </View>
                <View style={forecastStyles.searchContainer}>
                    <Input
                        placeholder="Search by city"
                        placeholderTextColor="#ededeb"
                        inputStyle={{color: "white"}}
                        onChangeText={keyword => setKeyword(keyword)}
                        value={keyword}
                    />
                    <Button
                        raised
                        onPress={() => handleSearch()}
                        buttonStyle={{
                            backgroundColor: "white",
                            borderColor: "transparent",
                            borderWidth: 0,
                            borderRadius: 100,
                        }}
                        containerStyle={{
                            width: 60,
                            borderRadius: 100
                        }}
                        icon={{
                            name: "search", 
                            color: weatherConditions[weatherMain].bgColor,
                            size: 40,
                        }}
                    />
                </View>
            </View>
            <StatusBar hidden style="auto" />
        </View>
    );
}