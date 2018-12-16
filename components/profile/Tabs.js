import 'isomorphic-fetch';
import { Component } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';

import { removeReadBook, removeWillReadBook, receiveError, receiveMyPosts } from '../../ducks/actions';
import PostCard from '../PostCard';
import BookCard from '../BookCard';

const mapStateToProps = (state) => (
{
    user: state.user,
});

const mapDispatchToProps = (dispatch) => (
{
    error: (msg) => dispatch(receiveError(msg)),
    deleteReadBook: (user, index) => dispatch(removeReadBook({ username: user.username, utoken: user.utoken, index })),
    deleteWillReadBook: (user, index) => dispatch(removeWillReadBook({ username: user.username, utoken: user.utoken, index })),
    getPosts: (user) => dispatch(receiveMyPosts({ user: user.username, username: user.username, utoken: user.utoken })),
});

export default connect(mapStateToProps, mapDispatchToProps)(class extends Component
{
    state =
    {
        value: 'posts',
    };

    handleChange = (event, value) => this.setState({ value });

    componentDidMount()
    {
        const { user } = this.props;
        if (user.posts.length === 0)
        {
            this.props.getPosts(user);
        }
    }
    
    render()
    {
        const { user, deleteReadBook, deleteWillReadBook } = this.props;
        const { posts, books } = this.props.user;
        const { reading, will_read, have_read } = books;
        const { value } = this.state;
        return (
            <>
                <NoSsr>
                    <Paper square className='bookshelf-profile-tabs-container'>
                        <Tabs value={ value } indicatorColor='primary' textColor='primary' onChange={ this.handleChange }>
                            <Tab value='posts' label='Posts' />
                            <Tab value='books' label='Books' />
                        </Tabs>
                    </Paper>
                </NoSsr>
                { value === 'posts' && <div className='bookshelf-profile-books-container'>
                    { (posts ? posts.length === 0 : true) && <Typography variant='title' color='default'>No posts yet</Typography> }
                    { posts.length > 0 && <GridList style={{ width: '100%', height: '100%' }} cols={ 3 }>
                        { posts.map(post => (
                        <GridListTile key={ post.post_id } cols={ 1 }>
                            <PostCard { ...post } />
                        </GridListTile>
                        )) }
                    </GridList> }
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