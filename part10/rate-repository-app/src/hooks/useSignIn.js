import { useApolloClient, useMutation } from "@apollo/client";
import { SIGN_IN } from "../graphql/mutations";
import useAuthStorage from "./useAuthStorage";
import { useNavigate } from "react-router-native";

const useSignIn = () => {
    const authStorage = useAuthStorage();
    const [mutate, result] = useMutation(SIGN_IN);
    const navigate = useNavigate();
    const apolloClient = useApolloClient();

    const signIn = async ({ username, password }) => {
        const response = await mutate({variables: {credentials: { username, password}}})
        await authStorage.setAccessToken(response.data.authenticate.accessToken);
        navigate('/');
        apolloClient.resetStore();
        return response;
    };

    return [signIn, result];
};

export default useSignIn;