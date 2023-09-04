import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import InputForm from "../Components/InputForm";
import SubmitButton from "../Components/SubmitButton";
import { colors } from "../Global/Colors";
import { useSignUpMutation } from "../Services/authServices";
import { useDispatch } from "react-redux";
import { setUser } from "../Features/User/userSlice";
import { isAtLeastSixCharacters, isValidEmail } from "../Validations/auth";
/* import { useSignUpMutation } from "../services/authService";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
import { signupSchema } from "../validations/singupSchema"; */

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [errorMail, setErrorMail] = useState("");
    const [password, setPassword] = useState("");
    const [errorPassword, setErrorPassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("");
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

    const [triggerSignUp, result] = useSignUpMutation()
    const dispatch = useDispatch()

    useEffect(()=> {
        if (result.isSuccess) {
            dispatch(
                setUser({
                    email: result.data.email,
                    idToken: result.data.idToken,
                    localId: result.data.localId,
                    profileImage: "",
                    location: {
                        latitude: "",
                        longitude: "",
                    },
                })
            )
        }
    }, [result])

    const onSubmit = () => {
        try {
            //Submit logic with validations
            const isValidVariableEmail = isValidEmail(email)
            const isCorrectPassword = isAtLeastSixCharacters(password)
            const isRepeatedPasswordCorrect = password === confirmPassword

            if (isValidVariableEmail && isCorrectPassword && isRepeatedPasswordCorrect) {
                const request = {
                    email,
                    password,
                    returnSecureToken: true
                }
                triggerSignUp(request)
            }

            if (!isValidVariableEmail) setErrorMail ('Email no es correcto')
            else setErrorMail('')
            if (!isCorrectPassword) setErrorPassword ('Password debe tener al menos 6 caracteres')
            else setErrorPassword('')
            if (!isRepeatedPasswordCorrect) setErrorConfirmPassword ('Las contraseñas deben coincidir')
            else setErrorConfirmPassword('')

        } catch (err) {
            console.log("Catch error");
            console.log(err.message);
        }
    };

    return (
        <View style={styles.main}>
            <View style={styles.container}>
                <Image
                    source={require("../Assets/Images/logo.png")}
                    style={styles.image}
                    resizeMode="cover"
                />
                <Text style={styles.title}>Crea tu cuenta</Text>
                <InputForm label={"E-mail"} onChange={setEmail} error={errorMail} />
                <InputForm
                    label={"Contraseña"}
                    onChange={setPassword}
                    error={errorPassword}
                    isSecure={true}
                />
                <InputForm
                    label={"Confirmar Contraseña"}
                    onChange={setconfirmPassword}
                    error={errorConfirmPassword}
                    isSecure={true}
                />
                <SubmitButton onPress={onSubmit} title="Registrarse" />
                <Text style={styles.sub}>Ya tenés cuenta?</Text>
                <Pressable onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.subLink}>Ingresar</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default SignupScreen;

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
        fontFamily: "Josefin",
        color: "black",
    },
    subLink: {
        fontSize: 14,
        fontFamily: "Josefin",
        color: "blue",
    },
    image: {
        width: 280,
        height: 280,
        borderRadius: 50,
    },
});
