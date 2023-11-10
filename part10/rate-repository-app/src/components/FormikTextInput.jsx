import { StyleSheet } from "react-native";
import { useField } from 'formik';

import TextInput from "./TextInput";
import Text from "./Text";
import theme from "./theme";

const styles = StyleSheet.create({
    errorText: {
        marginBottom: 10,
        color: '#d73a4a'
    },
    input: {
        borderColor: theme.colors.textSecondary,
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
    error: {
        borderColor: '#d73a4a',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    }
});



const FormikTextInput = ({name, ...props}) => {
    const [field, meta, helpers] = useField(name);
    const showError = meta.touched && meta.error;

    return (
        <>
            <TextInput
                onChangeText={value => helpers.setValue(value)}
                onBlur={() => helpers.setTouched(true)}
                value={field.value}
                error={showError}
                style={[styles.input, styles.error]}
                {...props}
            />
            {showError && <Text style={styles.errorText}>{meta.error}</Text>}
        </>
    );
};

export default FormikTextInput;