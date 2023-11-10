import { StyleSheet } from 'react-native';
import { Link } from 'react-router-native';
import Text from '../Text';
import useAuthStorage from "../../hooks/useAuthStorage";
import { useApolloClient } from '@apollo/client';


const styles = StyleSheet.create({
    container: {
        color: 'white',
        marginRight: 15
    }
})

export const AppBarTab = ({ label, path }) => {
    const authStorage = useAuthStorage();
    const apolloClient = useApolloClient();

    const signOut = async () => {
        await authStorage.removeAccessToken();
        apolloClient.resetStore();
    }

    return (
        <Link to={path} onPress={() => { label === 'Sign Out' && signOut() }}>
            <Text style={styles.container} fontWeight='bold' >{label}</Text>
        </Link>
    );
};

export default AppBarTab;