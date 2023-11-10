import { useApolloClient, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-native";
import { ADD_REVIEW } from "../graphql/mutations";

const useReview = () => {
    const [mutate, result] = useMutation(ADD_REVIEW);
    const navigate = useNavigate();
    const apolloClient = useApolloClient();

    const addReview = async ({ ownerName, rating, repositoryName, text }) => {
        const response = await mutate({ variables: { review: { ownerName, rating: Number(rating), repositoryName, text } } });
        navigate(`/${response.data.createReview.repositoryId}`);
        apolloClient.resetStore();
        return response;
    };

    return [addReview, result];
};

export default useReview;