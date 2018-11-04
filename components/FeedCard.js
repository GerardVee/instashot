import { connect } from 'react-redux';
import Router from 'next/router';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Like from '@material-ui/icons/FavoriteBorder';
import Liked from '@material-ui/icons/Favorite';

import { deletePost, unlikePost, likePost } from '../ducks/actions';

const base = '/';

const mapStateToProps = (state) => (
{
    userstats: state.user,
});

const mapDispatchToProps = dispatch => (
{
    unlikePost: (user, post_id) => dispatch(unlikePost({ user_id: user.user_id, utoken: user.utoken, post_id })),
    likePost: (user, post_id) => dispatch(likePost({ user_id: user.user_id, utoken: user.utoken, post_id })),
    deletePost: (user, post_id) => dispatch(deletePost({ user_id: user.user_id, utoken: user.utoken, post_id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(({ date, about, about_type, book_id, post_id, text, user, profile_picture, likes_count, liked, interactable, userstats, deletePost, unlikePost, likePost, setLikeOnPost }) => (
    <Paper style={{ paddingBottom: '0.5em' }}>
        <div className='row' style={{ alignItems: 'center' }}>
            { profile_picture && <Avatar src={ profile_picture } style={{ margin: 10 }} /> }
            <Typography variant='body1' style={{ marginLeft: '1em' }}>{ user }</Typography>
        </div>
        <Typography variant='body1' style={{ marginLeft: '1em' }}>{ text }</Typography>
        <div className='row' style={{ justifyContent: 'space-between' }}>
            <div className='row align-center'>
                <IconButton disabled={ !interactable } onClick={ () =>
                    {
                        liked ? unlikePost(userstats, post_id) : likePost(userstats, post_id);
                        setLikeOnPost(!liked);
                    } }>{ liked ? <Liked color='secondary' /> : <Like /> }</IconButton>
                <Typography variant='body1'>{ likes_count }</Typography>
            </div>
            { about_type !== 'NONE' && <Button size='small' variant='text' color='default' onClick={ () => Router.push(`${ base }book?id=${ book_id }`) } className='center'>
            📖 { about }
            </Button> }
        </div>
    </Paper>
));