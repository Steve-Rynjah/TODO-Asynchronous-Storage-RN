import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { width, height } = Dimensions.get("window");

export const TodoListScreen = () => {
  const [todo, setTodo] = useState([]);
  const [textInput, setTextInput] = useState("");

  useEffect(() => {
    getTodo();
  }, []);

  useEffect(() => {
    saveTodo(todo);
  }, [todo]);
  
  //Sorting In Alphabetic Order
  todo.sort(function(a,b) {
    if(a.task.toLowerCase() < b.task.toLowerCase()) 
      return -1;
      if(a.task.toLowerCase() < b.task.toLowerCase()) 
      return 1;
      return 0
  })

  const ListItem = ({ data }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: "#FFA500",
              textDecorationLine: data?.completed ? "line-through" : "none",
            }}
          >
            {data?.task}
          </Text>
        </View>
        {!data?.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(data.id)}>
            <Ionicons name="checkmark-circle" size={24} color="#00fc3b" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{ marginLeft: 15 }}
          onPress={() => deleteTodo(data.id)}
        >
          <Entypo name="circle-with-cross" size={24} color="#fc1900" />
        </TouchableOpacity>
      </View>
    );
  };

  const saveTodo = async (todos) => {
    try {
      const value = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", value);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodo = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      if (todos != null) {
        setTodo(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = () => {
    if (textInput == "") {
      Alert.alert("Error", "Please input todo");
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodo([...todo, newTodo]);
      setTextInput("");
    }
  };

  const markTodoComplete = (todoId) => {
    const newTodoItem = todo.map((item) => {
      if (item.id === todoId) {
        return { ...item, completed: true };
      }
      return item;
    });
    setTodo(newTodoItem);
  };

  const deleteTodo = (todoId) => {
    const newTodoItem = todo.filter((item) => item.id !== todoId);
    setTodo(newTodoItem);
  };

  const clearAllTodo = () => {
    Alert.alert("Confirm", "Clear todo?", [
      {
        text: "Yes",
        onPress: () => setTodo([]),
      },
      {
        text: "No",
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <StatusBar backgroundColor="#333" />
      <View style={styles.header}>
        <Text style={styles.title}>List of TODO</Text>
        <TouchableOpacity onPress={clearAllTodo}>
          <Text style={styles.title}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todo}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <ListItem data={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.input}>
          <TextInput
            style={styles.textInput}
            placeholder="Add Todo"
            value={textInput}
            onChangeText={(text) => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Text style={{ color: "#FFF", fontSize: 24 }}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: width,
    height: height / 10,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
  },
  title: {
    fontWeight: "bold",
    fontSize: 17,
    color: "#FFA500",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#333",
    width: width,
    height: height / 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: "#FFF",
    flex: 1,
    height: height / 15,
    marginVertical: 20,
    marginRight: 25,
    borderRadius: 30,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  textInput: {
    color: "#FFA500",
  },
  iconContainer: {
    width: width / 10 + 10,
    height: height / 20 + 10,
    backgroundColor: "#FFA500",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    padding: 20,
    backgroundColor: "#555",
    flexDirection: "row",
    elevation: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
});
