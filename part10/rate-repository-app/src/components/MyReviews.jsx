import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { styles } from "./RepositoryList/RepositoryItem";
import Text from "./Text";
import { format } from "date-fns";
import { GET_CURRENT_USER } from "../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-native";
import { DELETE_REVIEW } from "../graphql/mutations";

const reviewStyles = StyleSheet.create({
    reviewCard: {
        padding: 10,
        backgroundColor: 'white'
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
        flexGrow: 1
    },
    buttons: {
        flexDirection: 'row'
    }
});

const ReviewItem = ({ review, user, refetch }) => {
    const [mutate, result] = useMutation(DELETE_REVIEW);

    const deleteReview = () => {
        Alert.alert('Delete review', 'Are you sure you want to delete this review? ', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: async () => {
                console.log(result);
                await mutate({variables: {deleteReviewId: review.id}})
                refetch()
            }},
          ]);
    }

    return (
        <View style={reviewStyles.reviewCard}>
            <View style={styles.reviewCard}>
                <View style={review.rating < 100 ? styles.reviewRating : styles.reviewRating100}>
                    <Text color='primary'>{review.rating}</Text>
                </View>
                <View style={styles.reviewInfo}>
                    <Text fontWeight='bold'>{user.username}</Text>
                    <Text color='textSecondary'>{format(new Date(review.createdAt), 'MM.dd.yyyy')}</Text>
                    <Text style={styles.reviewText}>{review.text}</Text>
                </View>
            </View>
            <View style={reviewStyles.buttons}>
                <View style={styles.button}>
                    <Link  to={`/${review.repositoryId}`}>
                        <Text style={styles.text} fontWeight='bold' fontSize='subheading'>View repository</Text>
                    </Link>
                </View>
                <View style={reviewStyles.deleteButton}>
                    <Pressable onPress={deleteReview} >
                        <Text style={styles.text} fontWeight='bold' fontSize='subheading'>Delete review</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
};

const ItemSeparator = () => <View style={styles.separator} />;

const Reviews = () => {
    const { data, error, loading, refetch } = useQuery(GET_CURRENT_USER, {
        fetchPolicy: 'cache-and-network',
        variables: { includeReviews: true }
    });

    if (loading) {
        return null;
    } else if (error) {
        console.log('error', error);
    }

    const { me } = data;



    const reviewNodes = me.reviews
        ? me.reviews.edges.map(edge => edge.node)
        : [];

    if (!reviewNodes.length) {
        return (
            <View style={styles.repositoryCard}>
                <Text style={{ textAlign: 'center' }} fontWeight='bold' fontSize='subheading'>You do not have any review</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={reviewNodes}
            ItemSeparatorComponent={ItemSeparator}
            renderItem={({ item }) => <ReviewItem review={item} user={me} refetch={refetch} />}
            keyExtractor={({ id }) => id}
        />
    );
};

export default Reviews;
