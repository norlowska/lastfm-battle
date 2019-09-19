/*
 *  Battle
 *
 *  Page containing whole battle between two users.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUser } from '../../actions/fetchUser';
import User from '../User/User';
import Loader from '../Loader/Loader';
import './style.css';

class Battle extends Component {
    componentDidMount() {
        var users = this.props.location.pathname.split('/').slice(-2);
        this.props.fetchUser(users[0]);
        this.props.fetchUser(users[1]);
    }

    // Calculate categories in which users win
    calculateWins(user1, user2) {
        var categories = [ "total", "scrobblesThisYear", "scrobblesThisMonth", "scrobblesThisWeek" ];
        var u1scores = [ Number(user1.playcount), Number(user1.scrobblesThisYear), Number(user1.scrobblesThisMonth), Number(user1.scrobblesThisWeek) ];
        var u2scores = [ Number(user2.playcount), Number(user2.scrobblesThisYear), Number(user2.scrobblesThisMonth), Number(user2.scrobblesThisWeek) ];

        var u1wins = [];
        var u2wins = [];

        for(var i = 0; i < u1scores.length; i++) {
            if(u1scores[i] > u2scores[i]) {
                u1wins.push(categories[i]);
            } else if(u2scores[i] > u1scores[i]) {
                u2wins.push(categories[i]);
            }
        }
       return { user1: u1wins, user2: u2wins };
    }

    render() {
        const { isPending, error, user1, user2 } = this.props;

        if(error) {
            return <div className="center-container"><p>An error ocurred: {error.message}. Contact me: norlowska[at]mail.com</p></div>;
        }

        if(isPending){
            return <div className="center-container"><Loader /></div>;
        }

        var wins = this.calculateWins(user1, user2);

        return (
            <div className="battle-container">
                <header className="small-logo">
                    <h2><Link className="back-button" to="/"><i className="arrow-left"></i></Link>Last.fm <span className="logo-white">battle</span></h2>
                </header>
                <main className="battle">
                    <User user={user1} wins={wins.user1} />
                    <div className="headings">
                        <h3 className="now-playing">Now playing</h3>
                        <h3 className="tracks-scrobbled">Tracks scrobbled</h3>
                        <h4 className="scrobbles-total">Total</h4>
                        <h4 className="scrobbles-this-year">This year</h4>
                        <h4 className="scrobbles-this-month">This month</h4>
                        <h4 className="scrobbles-this-week">This week</h4>
                    </div>
                    <User user={user2} wins={wins.user2} />
                </main>
            </div>
        );
    }
}

Battle.propTypes = {
    location: PropTypes.object.isRequired,
    fetchUser: PropTypes.func.isRequired,
    isPending: PropTypes.bool.isRequired,
    error: PropTypes.object,
    user1: PropTypes.object.isRequired,
    user2: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    isPending: state.isPending,
    error: state.error,
    user1: state.user1,
    user2: state.user2
});

export default connect(mapStateToProps,
    { fetchUser })(Battle);