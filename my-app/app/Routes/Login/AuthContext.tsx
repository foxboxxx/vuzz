import { createContext, useContext, useState, PropsWithChildren } from "react";
import { router } from 'expo-router';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { registerWithEmailAndPassword, logInWithEmailAndPassword } from "../../utils/firebase/firebase.utils";
import Logo from '../../../components/Logo';
import { useEffect } from "react";
import { auth } from "../../utils/firebase/firebase.utils";

type AuthContextType = {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    firstName: string;
    setFirstName: (name: string) => void;
    lastName: string;
    setLastName: (name: string) => void;
    age: string;
    setAge: (age: string) => void;
    city: string;
    setCity: (city: string) => void;
    state: string;
    setState: (state: string) => void;
    username: string;
    setUsername: (username: string) => void;
    isOrganizer: boolean;
    setIsOrganizer: (isOrganizer: boolean) => void;
    handleSignIn: () => Promise<void>;
    handleSignUp: () => Promise<void>;
    navigateToSignUp: () => void;
    latitude: number;
    setLatitude: (latitude: number) => void;
    longitude: number;
    setLongitude: (longitude: number) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function SignIn() {
    const { email, setEmail, password, setPassword, handleSignIn } = useAuth();
    
    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Logo />
                </View>
                
                <Text style={styles.title}>Log in</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Email or Username"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity 
                    style={styles.loginButton} 
                    onPress={handleSignIn}
                >
                    <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>
                        Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity onPress={() => router.push("../auth/signup")}>
                        <Text style={styles.signupLink}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [username, setUsername] = useState("");
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    
    const navigateToSignUp = () => {
        router.push("../auth/signup");
    };

    const handleSignUp = async () => {
        if (!email || !password || !firstName || !lastName || !age || !city || !state || !username) {
            alert('Please fill in all fields');
            return;
        }
        try {
            const userData = {
                firstName,
                lastName,
                age,
                city,
                state,
                username,
                latitude,
                longitude,
                isOrganizer,
                organizationVerified: false,
                tags: [],
                createdAt: new Date().toISOString(),
            };

            const user = await registerWithEmailAndPassword(email, password, userData);
            if (user) {
                if (isOrganizer) {
                    router.replace("/auth/organization-details");
                } else {
                    router.replace("/auth/select-tags");
                }
            }
        } catch (error: any) {
            alert(error.message || "Registration failed");
            console.error("Registration error:", error);
        }
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        try {
            const result = await logInWithEmailAndPassword(email, password);
            if (result) {
                console.log("Navigating to tabs...");
                router.replace("/(tabs)");
            }
        } catch (error: any) {
            alert(error.message || "Sign in failed");
            console.error("Sign in error:", error);
        }
    };


    return (
        <AuthContext.Provider value={{
            email,
            setEmail,
            password,
            setPassword,
            firstName,
            setFirstName,
            lastName,
            setLastName,
            age,
            setAge,
            city,
            setCity,
            state,
            setState,
            username,
            setUsername,
            isOrganizer,
            setIsOrganizer,
            handleSignIn,
            handleSignUp,
            navigateToSignUp,
            latitude,
            setLatitude,
            longitude,
            setLongitude,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f7f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 30,
    },
    input: {
        width: '80%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: 'white',
    },
    loginButton: {
        width: '80%',
        height: 50,
        backgroundColor: '#4CAF50',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    signupContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    signupText: {
        color: '#666',
        fontSize: 16,
    },
    signupLink: {
        color: '#2196F3',
        fontSize: 16,
    },
});