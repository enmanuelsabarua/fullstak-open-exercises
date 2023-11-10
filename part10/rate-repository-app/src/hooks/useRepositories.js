import { useQuery } from "@apollo/client";
import { GET_REPOSITORIES } from "../graphql/queries";

const useRepositories = (selectedFilter, searchKeyword, fetchVariables) => {
    let filters = selectedFilter;

    switch (selectedFilter) {
        case 'latest':
            filters = { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
            break;
        case 'highest':
            filters = { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
            break;
        case 'lowest':
            filters = { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
            break;

        default:
            filters = { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
            break;
    }


    const variables = {
        orderBy: filters.orderBy,
        orderDirection: filters.orderDirection,
        searchKeyword,
        ...fetchVariables
    }


    const { data, error, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {
        fetchPolicy: 'cache-and-network',
        variables
    });

    const handleFetchMore = () => {
        const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;

        if (!canFetchMore) {
            return;
        }


        fetchMore({
            variables: {
                after: data.repositories.pageInfo.endCursor,
                ...variables,
            },
        });
    };

    const fetchRepositories = () => {
        if (loading) {
            return null;
        } else if (error) {
            console.log('error', error);
        }

        console.log('data', data.repositories);
        return data.repositories;
    }


    return { repositories: data?.repositories, fetchMore: handleFetchMore, loading, refetch: fetchRepositories, ...result }
};

export default useRepositories;