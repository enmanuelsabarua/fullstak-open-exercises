import { Pressable, View, StyleSheet } from 'react-native';
import Text from './Text';
import { Formik } from 'formik';
import FormikTextInput from './FormikTextInput';
import theme from './theme';
import * as yup from 'yup';
import useSignIn from '../hooks/useSignIn';
import useSignUp from '../hooks/useSignUp';


const initialValues = {
    username: '',
    password: '',
    // passwordConfirm: ''
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 15
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: 15,
        borderRadius: 5
    },
    text: {
        textAlign: 'center',
        color: 'white',
    }
});

const validationSchema = yup.object().shape({
    username: yup
        .string()
        .min(5, 'Username should be at least 5 characters')
        .max(30, 'Username should be less than 31 characters')
        .required('Username is required.'),
    password: yup
        .string()
        .min(5, 'Password should be at least 5 characters')
        .max(30, 'Password should be less than 31 characters')
        .required('Password is required.'),
    passwordConfirm: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Password do not match')
        .required('Password confirm is required')
});

const SignUpForm = ({ onSubmit }) => {
    return (
        <View style={styles.container}>
            <FormikTextInput name='username' placeholder='Username' />
            <FormikTextInput name='password' placeholder='Password' secureTextEntry />
            <FormikTextInput name='passwordConfirm' placeholder='Password confirm' secureTextEntry />
            <Pressable onPress={onSubmit} style={styles.button}>
                <Text style={styles.text} fontWeight='bold' fontSize='subheading'>Sign in</Text>
            </Pressable>
        </View>
    );
};

export const SignUpContainer = ({ onSubmit }) => {
    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            {({ handleSubmit }) => <SignUpForm onSubmit={handleSubmit} />}
        </Formik>
    );
}

const SignUp = () => {
    const [signUp] = useSignUp(); 
    const [signIn] = useSignIn(); 

    const onSubmit = async values => {
        const { username, password } = values;

        try {
            await signUp({ username, password });
            await signIn({ username, password });
        } catch (e) {
            console.log('error', e);
        }
    }

    return <SignUpContainer onSubmit={onSubmit} />
};

export default SignUp;