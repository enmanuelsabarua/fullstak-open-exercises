import React from 'react';
import { FlatList } from 'react-native';
import { RepositoryItem } from './RepositoryItem';
import useRepositories from '../../hooks/useRepositories';
import { Link } from 'react-router-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Searchbar } from 'react-native-paper';
import { useDebounce } from 'use-debounce';

const RepositoryListHeader = ({ selectedFilter, setSelectedFilter, searchQuery, setSearchQuery }) => {

    const onChangeSearch = query => setSearchQuery(query);

    return (
        <>
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
                style={{backgroundColor: 'white', margin: 10}}
            />
            <Picker
                selectedValue={selectedFilter}
                onValueChange={(itemValue) =>
                    setSelectedFilter(itemValue)
                }
            >
                <Picker.Item label="Select an item..." color='gray' value='default' />
                <Picker.Item label="Latest repositories" value='latest' />
                <Picker.Item label="Highest rated repositories" value='highest' />
                <Picker.Item label="Lowest rated repositories" value='lowest' />
            </Picker>
        </>
    );
}

export class RepositoryListContainer extends React.Component {
    renderHeader = () => {
        const props = this.props;
        return (
            <RepositoryListHeader
                selectedFilter={props.selectedFilter}
                setSelectedFilter={props.setSelectedFilter}
                searchQuery={props.searchQuery}
                setSearchQuery={props.setSearchQuery}
            />
        );
    };

    render() {
        const repositoryNodes = this.props.repositories
            ? this.props.repositories.edges.map(edge => edge.node)
            : [];

        return (
            <FlatList
                data={repositoryNodes}
                renderItem={({ item }) => {
                    return (<Link to={`/${item.id}`}>
                        <RepositoryItem repository={item} />
                    </Link>);
                }}
                keyExtractor={item => item.id}
                ListHeaderComponent={this.renderHeader}
                onEndReached={this.props.onEndReach}
                onEndReachedThreshold={0.5}
            />
        );
    }
}

const RepositoryList = () => {
    const [selectedFilter, setSelectedFilter] = useState();
    const [searchQuery, setSearchQuery] = useState();
    const [value] = useDebounce(searchQuery, 500);

    const { repositories, fetchMore } = useRepositories(selectedFilter, value, {first: 8});

    const onEndReach = () => {
        fetchMore();
    };

    return <RepositoryListContainer repositories={repositories} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onEndReach={onEndReach} />;
};

export default RepositoryList;