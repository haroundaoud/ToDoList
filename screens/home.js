import { useNavigation } from "@react-navigation/native";
import * as Device from 'expo-device';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
 import { Alert } from "react-native";


export default function HomeScreen() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();
  // logout function

const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            navigation.replace("login");
          } catch (error) {
            console.log("Error logging out:", error);
          }
        },
      },
    ],
    { cancelable: true }
  );
};


  // Interface utilisateur
  useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", user.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const tasksData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(tasksData);
  });

  return () => unsubscribe();
}, []);

// add task to firestore
const addTask = async () => {
  if (task.trim() === "") return;

  const user = auth.currentUser;
  if (!user) return;

  try {
    await addDoc(collection(db, "tasks"), {
      title: task,
      completed: false,
      userId: user.uid,
      createdAt: serverTimestamp(),
    });

    setTask("");
  } catch (error) {
    console.log("Error adding task:", error);
  }
};

const toggleTask = async (id, completed) => {
  try {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, {
      completed: !completed,
    });
  } catch (error) {
    console.log("Error updating task:", error);
  }
};

// show phone details
const handeldetails = () => {
  Alert.alert(
    "Phone Details",
    `Brand: ${Device.brand}\nModel: ${Device.modelName}\nOS: ${Device.osName} ${Device.osVersion}\nUUID: ${Device.osBuildId}`,
    [{ text: "OK" }],
    { cancelable: true }
  );
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 To-Do List</Text>
      <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.task,
              item.completed && styles.taskFinished,
            ]}
            onPress={() => toggleTask(item.id, item.completed)}
          >
            <Text
              style={[
                styles.taskText,
                item.completed && styles.taskTextFinished,
              ]}
            >
              {item.title}
            </Text>
            {item.completed && <Text>✅</Text>}
          </TouchableOpacity>
        )}
      />
      {/* chek phone details */}
      <TouchableOpacity>
        <Text style={[
          styles.details]} onPress={handeldetails} >
            Your phone details</Text>

      </TouchableOpacity>
       
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  logout: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "right",
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  details: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 60,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  addText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  task: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskFinished: {
    backgroundColor: "#d4edda",
  },
  taskText: {
    fontSize: 16,
  },
  taskTextFinished: {
    textDecorationLine: "line-through",
    color: "#6c757d",
  },
});
