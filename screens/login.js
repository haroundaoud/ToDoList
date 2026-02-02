import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();


  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      let user = auth.currentUser;
      const docRef = doc (db,"users",user.uid);
      const docSnap = await getDoc (docRef);
      if (docSnap.exists()){
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
      let userData = docSnap.data();
      alert(`Welcome back, ${userData.name}!`);
      navigation.navigate("home");
    
     
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("register")}>
  <Text style={{ textAlign: "center", marginTop: 20 }}>
    Don’t have an account? Sign Up
  </Text>
</TouchableOpacity>

      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
