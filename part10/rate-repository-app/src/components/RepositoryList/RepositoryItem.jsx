import { View, Image, StyleSheet, Pressable, FlatList } from "react-native";
import Text from "../Text";
import Stat from "./Stat";
import { useParams } from "react-router-native";
import { GET_REPOSITORY } from "../../graphql/queries";
import { useQuery } from "@apollo/client";
import theme from "../theme";
import * as Linking from 'expo-linking';
import { format } from 'date-fns';

export const styles = StyleSheet.create({
  tinyImage: {
    height: 40,
    width: 40
  },
  basicInfoContainer: {
    flexDirection: 'row',
  },
  repositoryCard: {
    padding: 20,
    backgroundColor: "white",
    marginBottom: 10
  },
  repositoryTextData: {
    paddingLeft: 15,
    flexShrink: 1
  },
  language: {
    backgroundColor: "#0366d6",
    color: 'white',
    textAlign: 'center',
    padding: 4,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    alignSelf: 'flex-start'
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 10,
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    flexGrow: 1,
    marginRight: 10
  },
  separator: {
    height: 10
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
  },
  reviewInfo: {
    marginLeft: 10,
    flexShrink: 1
  },
  reviewText: {
    marginTop: 5
  },
  reviewRating: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 30 / 2,
    borderColor: '#0366d6',
    padding: 5
  },
  reviewRating100: {
    width: 39,
    height: 30,
    borderWidth: 1,
    borderRadius: 30 / 2,
    borderColor: '#0366d6',
    padding: 5

  }
})

export const RepositoryItem = ({ repository, singleRepo }) => {
  return (
    <View testID="repositoryItem" style={styles.repositoryCard}>
      <View style={styles.basicInfoContainer}>
        <Image style={styles.tinyImage} source={{ uri: `${repository.ownerAvatarUrl}` }} />
        <View style={styles.repositoryTextData}>
          <Text fontWeight='bold' fontSize='subheading'>{repository.fullName}</Text>
          <Text color='textSecondary'>{repository.description}</Text>
          <Text style={styles.language}>{repository.language}</Text>
        </View>
      </View>


      <View style={styles.statsContainer}>
        <Stat number={repository.stargazersCount} text='Starts' />
        <Stat number={repository.forksCount} text='Forks' />
        <Stat number={repository.reviewCount} text='Reviews' />
        <Stat number={repository.ratingAverage} text='Rating' />
      </View>

      {singleRepo &&
        <Pressable style={styles.button} onPress={() => Linking.openURL(repository.url)}>
          <Text style={styles.text} fontWeight='bold' fontSize='subheading'>GitHub</Text>
        </Pressable>
      }
    </View>
  )
};


const ReviewItem = ({ review }) => {
  return (
    <View style={styles.reviewCard}>
      <View style={review.rating < 100 ? styles.reviewRating : styles.reviewRating100}>
        <Text color='primary'>{review.rating}</Text>
      </View>
      <View style={styles.reviewInfo}>
        <Text fontWeight='bold'>{review.user.username}</Text>
        <Text color='textSecondary'>{format(new Date(review.createdAt), 'MM.dd.yyyy')}</Text>
        <Text style={styles.reviewText}>{review.text}</Text>
      </View>
    </View>
  )
};

const ItemSeparator = () => <View style={styles.separator} />;

const SingleRepository = () => {
  const { id } = useParams();
  const { data, error, loading, fetchMore } = useQuery(GET_REPOSITORY, {
    fetchPolicy: 'cache-and-network',
    variables: { repositoryId: id, first: 6 }
  });

  if (loading) {
    return null;
  } else if (error) {
    console.log('error', error);
  }
  const { repository } = data;

  const reviewNodes = repository.reviews
    ? repository.reviews.edges.map(edge => edge.node)
    : []

    const handleFetchMore = () => {
      const canFetchMore = !loading && data?.repository.reviews.pageInfo.hasNextPage;
  
      if (!canFetchMore) {
        return;
      }
  
      fetchMore({
        variables: {
          after: data.repository.reviews.pageInfo.endCursor,
          repositoryId: id,
        },
      });
    };



  return (
    <FlatList
      data={reviewNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={() => <RepositoryItem repository={repository} singleRepo={true} />}
      onEndReached={handleFetchMore}
      onEndReachedThreshold={0.2}
    />
  );
};


export default SingleRepository;