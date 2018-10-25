import 'isomorphic-fetch';
import { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import BookCard from '../BookCard';
import { removeReadBook, removeWillReadBook } from '../../ducks/actions';

const mapStateToProps = (state) => (
{
    user: state.user,
});

const mapDispatchToProps = (dispatch) => (
{
    deleteReadBook: (user, index) => dispatch(removeReadBook({ user_id: user.user_id, utoken: user.utoken, index })),
    deleteWillReadBook: (user, index) => dispatch(removeWillReadBook({ user_id: user.user_id, utoken: user.utoken, index })),
});

export default connect(mapStateToProps, mapDispatchToProps)(class extends Component
{
    state =
    {
        value: 'posts',
    };

    handleChange = (event, value) => this.setState({ value });

    render()
    {
        const { user, deleteReadBook, deleteWillReadBook } = this.props;
        const { posts, books } = this.props.user;
        const { reading, will_read, have_read } = books;
        const { value } = this.state;
        return (
            <>
                <Paper square className='bookshelf-profile-tabs-container'>
                    <Tabs value={ value } indicatorColor='primary' textColor='primary' onChange={ this.handleChange }>
                        <Tab value='posts' label='Posts' />
                        <Tab value='books' label='Books' />
                    </Tabs>
                </Paper>
                { value === 'posts' && <div className='bookshelf-profile-books-container'>
                    { (posts ? posts.length === 0 : true) && <Typography variant='title' color='default'>No posts yet</Typography> }
                </div> }
                { value === 'books' && <div className='bookshelf-profile-books-container'>
                    <div className='bookshelf-profile-books-container-shelf col'>
                        <Typography variant='title' color='default'>Book I'm reading</Typography>
                        { reading.book_id !== '' && <BookCard { ...reading } immutable /> }
                        { reading.book_id === '' && <Typography variant='subheading' color='default'>No book here yet</Typography> }
                    </div>
                    <div className='bookshelf-profile-books-container-shelf col'>
                        <Typography variant='title' color='default'>Books I've read ({ have_read.length })</Typography>
                        <div className='row wrap'>
                        { have_read.map((book, index) =>
                            <BookCard { ...book } deleteBook={ () => deleteReadBook(user, index) } />) }
                        { have_read.length === 0 && <Typography variant='subheading' color='default'>No books here yet</Typography> }
                        </div>
                    </div>
                    <div className='bookshelf-profile-books-container-shelf col'>
                        <Typography variant='title' color='default'>Books I'll read ({ will_read.length })</Typography>
                        <div className='row wrap'>
                        { will_read.map((book, index) =>
                            <BookCard { ...book } deleteBook={ () => deleteWillReadBook(user, index) } />) }
                        { will_read.length === 0 && <Typography variant='subheading' color='default'>No books here yet</Typography> }
                        </div>
                    </div>
                </div> }
            </>
        );
    }
});