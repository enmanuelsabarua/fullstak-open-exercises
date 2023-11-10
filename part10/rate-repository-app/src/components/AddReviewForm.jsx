import { Pressable, View, StyleSheet } from 'react-native';
import Text from './Text';
import { Formik } from 'formik';
import FormikTextInput from './FormikTextInput';
import theme from './theme';
import * as yup from 'yup';
import useReview from '../hooks/useReview';


const initialValues = {
    ownerName: '',
    repositoryName: '',
    rating: '',
    text: ''
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 15
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: 15,
        borderRadius: 5
    },
    text: {
        textAlign: 'center',
        color: 'white',
    }
});

const validationSchema = yup.object().shape({
    ownerName: yup
        .string()
        .required('Repository owner name is required'),
    repositoryName: yup
        .string()
        .required('Repository name is required'),
    rating: yup
        .number()
        .min(0, 'Min rating is 0')
        .max(100, 'Max rating is 100')
        .required('Rating is require'),
    text: yup
        .string()
});

const ReviewForm = ({ onSubmit }) => {
    return (
        <View style={styles.container}>
            <FormikTextInput name='ownerName' placeholder='Repository owner name' />
            <FormikTextInput name='repositoryName' placeholder='Repository name' />
            <FormikTextInput name='rating' placeholder='Rating between 0 and 100' />
            <FormikTextInput name='text' placeholder='Review' multiple />
            <Pressable onPress={onSubmit} style={styles.button}>
                <Text style={styles.text} fontWeight='bold' fontSize='subheading'>Create a review</Text>
            </Pressable>
        </View>
    );
};

const Review = () => {
    const [addReview] = useReview();

    const onSubmit = async values => {
        const { ownerName, rating, repositoryName, text } = values;

        try {
            const { data } = await addReview({ ownerName, rating, repositoryName, text });
            console.log(data);
        } catch (e) {
            console.log('error', e);
        }
    }

    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
            {({ handleSubmit }) => <ReviewForm onSubmit={handleSubmit} />}
        </Formik>
    );
};

export default Review;