import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import InputForm from "../Components/InputForm";
import SubmitButton from "../Components/SubmitButton";
import { colors } from "../Global/Colors";
import { useSignInMutation } from "../Services/authServices";
import { isAtLeastSixCharacters, isValidEmail } from "../Validations/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../Features/User/userSlice";
import { insertSession } from "../SQLite";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorEmail, setErrorEmail] = useState('')
    const [errorPassword, setErrorPassword] = useState('')

    const dispatch = useDispatch()

    const [triggerSignIn, resultSignIn] = useSignInMutation();
    const onSubmit = () => {

        //Submit logic with validations
        const isValidVariableEmail = isValidEmail(email)
        const isCorrectPassword = isAtLeastSixCharacters(password)

        if (isValidVariableEmail && isCorrectPassword) {
            triggerSignIn({
                email,
                password,
                returnSecureToken: true,
            });
        }

        if (!isValidVariableEmail) setErrorEmail ('Email no es correcto')
        else setErrorEmail('')
        if (!isCorrectPassword) setErrorPassword ('Password debe tener al menos 6 caracteres')
        else setErrorPassword('')
    };

    useEffect(()=> {
        (async ()=> {
            try {
                if(resultSignIn.isSuccess) {

                    //Insert session in SQLite database
                    console.log('inserting Session');
                    const response = await insertSession({
                        idToken: resultSignIn.data.idToken,
                        localId: resultSignIn.data.localId,
                        email: resultSignIn.data.email,
                    })
                    console.log('Session inserted: ');
                    console.log(response);

                    dispatch(setUser({
                        email: resultSignIn.data.email,
                        idToken: resultSignIn.data.idToken,
                        localId: resultSignIn.data.localId,
                        profileImage: "",
                        location: {
                            latitude: "",
                            longitude: "",
                        }
                    }))
                }
            } catch (error) {
                console.log(error.message);
            }
        })()
    }, [resultSignIn])

    return (
        <View style={styles.main}>
            <View style={styles.container}>
                <Image
                    source={require("../Assets/Images/logo.png")}
                    style={styles.image}
                    resizeMode="cover"
                />
                <Text style={styles.title}>Loguearse para comenzar</Text>
                <InputForm
                    label={"E-mail"}
                    onChange={(email) => setEmail(email)}
                    error={errorEmail}
                />
                <InputForm
                    label={"Contraseña"}
                    onChange={(password) => setPassword(password)}
                    error={errorPassword}
                    isSecure={true}
                />
                <SubmitButton onPress={onSubmit} title="Enviar" />
                <Text style={styles.sub}>No tenés cuenta?</Text>
                <Pressable onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.subLink}>Registrarse</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    main: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "90%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.lightPink,
        gap: 15,
        paddingVertical: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 22,
        fontFamily: "Josefin",
    },
    sub: {
        fontSize: 14,
        color: "black",
    },
    subLink: {
        fontSize: 14,
        color: "blue",
    },
    image: {
        width: 280,
        height: 280,
        borderRadius: 50,
    },
});
