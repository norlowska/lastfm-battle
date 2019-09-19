/*
 * User
 *
 * Shows user's info and scrobbling stats.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

export default function User(props) {
    const { user, wins } = props;

    // Display now playing track if exists
    var nowPlaying = user.nowPlaying ? (<div className="now-playing">
            {user.nowPlaying.artist} - <span className="now-playing-song">{user.nowPlaying.name}</span>
        </div>) : <div className="now-playing">-</div>;


    // Format numbers by splitting in 3-digits groups and separate with spaces
    function formatNumber(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    var playcount = formatNumber(user.playcount);
    var scrobblesThisYear = formatNumber(user.scrobblesThisYear);
    var scrobblesThisMonth = formatNumber(user.scrobblesThisMonth);
    var scrobblesThisWeek = formatNumber(user.scrobblesThisWeek);

    return (
            <div className="user-container">
                <div className="avatar">
                    <img src={Object.values(user.image[2])[1]} alt="User's avatar"></img>
                </div>
                <div className="username"><h3>{user.name}</h3></div>
                { nowPlaying }
                <div className="scrobbles-total">{playcount} {wins.includes("total") ? <img className="trophy" src="/trophy.svg" alt="Total playcount category winner's trophy" /> : ""}</div>
                <div className="scrobbles-this-year">{scrobblesThisYear} {wins.includes("scrobblesThisYear") ? <img className="trophy" src="/trophy.svg" alt="Scrobbles this year category winner's trophy" /> : ""}</div>
                <div className="scrobbles-this-month">{scrobblesThisMonth} {wins.includes("scrobblesThisMonth") ? <img className="trophy" src="/trophy.svg" alt="Scrobbles this month category winner's trophy" /> : ""}</div>
                <div className="scrobbles-this-week">{scrobblesThisWeek} {wins.includes("scrobblesThisWeek") ? <img className="trophy" src="/trophy.svg" alt="Scrobbles this week category winner's trophy" /> : ""}</div>
            </div>
        );
}

User.propTypes = {
    user: PropTypes.object.isRequired,
    wins: PropTypes.arrayOf(PropTypes.string).isRequired
};