import { View, StyleSheet } from "react-native";
import Text from "../Text";

const styles = StyleSheet.create({
    statText: {
        textAlign: 'center'
    }
})

const Stat = ({ number, text }) => {
    let newNumber = 0;
    if (number > 1000) {
        newNumber = number / 1000;
        newNumber = `${newNumber.toFixed(1)} k`;
    } else {
        newNumber = number;
    }

    return (
        <View>
            <Text fontWeight='bold' fontSize='subheading' style={styles.statText}>{newNumber}</Text>
            <Text color='textSecondary' >{text}</Text>
        </View>
    );
};

export default Stat;