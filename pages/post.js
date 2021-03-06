import 'isomorphic-fetch';
import '../styles/index.scss';
import React, { Component } from 'react';
import Header from '../components/Header';
import NotFound from '../components/post/NotFound';
import Post from '../components/post/';
import Title from '../components/Title';
import { connect } from 'react-redux';
import { post as pst } from '../utils/methods';
import { receiveError } from '../ducks/actions';

const mapStateToProps = (state) => ({ user: state.user });

const mapDispatchToProps = (dispatch) => ({ error: (msg) => dispatch(receiveError(msg)) });

export default connect(mapStateToProps, mapDispatchToProps)(class extends Component
{
    state =
    {
        post: null,
        comments: []
    };

    static async getInitialProps({ query })
    {
        const { id } = query;
        return { id };
    }

    async componentDidMount()
    {
        const { user, id } = this.props;
        if (user.username !== '')
        {
            const postReq = await fetch('https://78g40e4ff5.execute-api.us-east-1.amazonaws.com/prod/bookshelf/post/find', pst({ post_id: id, username: user.username, utoken: user.utoken }));
            const res = await postReq.json();
            if (typeof(res) === typeof(String))
            {
                this.props.error(res);
                return;
            }
            else if (res.errorMsg)
            {
                this.props.error('Failed to fetch posts');
                return;
            }
            else if (!res.post)
            {
                this.props.error('Post not found');
                this.setState({ error: true });
            }
            const { post, comments } = res;
            this.setState({ post, comments });
        }
    }

    render()
    {
        const { post, comments, error } = this.state;
        return (
            <div className='bookshelf-page'>
                <Header />
                { error && <><Title>Post Not Found</Title><NotFound /></> }
                { post && <><Title>{ post.text.slice(0, 9) + '...' }</Title><Post post={ post } comments={ comments } /></> }
            </div>
        );
    }
});