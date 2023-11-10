import { TextInput as NativeTextInput } from "react-native";

// const styles = StyleSheet.create({});

const TextInput = ({ style, error, ...props }) => {
    {error && console.log(error);}
    const [normalStyle, errorStyle] = style;
    let textInputStyles = error ? errorStyle : normalStyle;

    return < NativeTextInput style={textInputStyles} {...props} />
}

export default TextInput;