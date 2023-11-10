import { useApolloClient, useMutation } from "@apollo/client";
import { SIGN_UP } from "../graphql/mutations";
import { useNavigate } from "react-router-native";

const useSignUp= () => {
    const [mutate, result] = useMutation(SIGN_UP);
    const navigate = useNavigate();
    const apolloClient = useApolloClient();

    const signUp = async ({ username, password }) => {
        const response = await mutate({variables: {user: { username, password}}})
        navigate('/');
        apolloClient.resetStore();
        return response;
    };

    return [signUp, result];
};

export default useSignUp;