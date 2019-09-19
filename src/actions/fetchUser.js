import {fetchUserPending, fetchUserSuccess, fetchUserError} from './index';
import axios from 'axios';

const apiUrl = 'https://ws.audioscrobbler.com/2.0/';
const apiKey = 'api_key=43d29806aac0cd9f7bac14612e06e46e';

export const fetchUser = (username) => {
    return function(dispatch) {
        dispatch(fetchUserPending());

        var current = new Date();
        var currentYear = current.getFullYear();
        var currentMonth = current.getMonth();
        var lastMonday = current.getDate() - current.getDay() + 1;
        var firstDayOfWeek;
        // Set last Monday to firstDayOfWeek, checking if this Monday was in previous month and/or previous year
        if(lastMonday < current.getDate()) {
            if(currentMonth === 0) {
                firstDayOfWeek = new Date(currentYear - 1, 11, lastMonday, 0, 0, 0);
            } else {
                firstDayOfWeek = new Date(currentYear, currentMonth, lastMonday, 0, 0, 0);
            }
        } else {
            firstDayOfWeek = new Date(currentYear, currentMonth, lastMonday, 0, 0, 0);
        }

        /* API calls for:  [user info,
                            tracks from the start of the year,
                            tracks from the start of the month,
                            tracks from last week,
                            --TODO--all listened artists,
                            --TODO--all listened albums]
        ]*/
        return axios.all([axios.get(apiUrl + '?method=user.getInfo&user=' + username + '&' + apiKey + '&format=json'),
                          axios.get(apiUrl + '?method=user.getrecenttracks&user=' + username + '&from=' + Date.UTC(currentYear, 0, 1, 0, 0, 0) / 1000 + '&to' + Date.now() / 1000 + '&limit=1&' + apiKey + '&format=json'),
                          axios.get(apiUrl + '?method=user.getrecenttracks&user=' + username + '&from=' + Date.UTC(currentYear, currentMonth, 1, 0, 0, 0) / 1000 + '&to' + Date.now() / 1000 + '&limit=1&' + apiKey + '&format=json'),
                          axios.get(apiUrl + '?method=user.getrecenttracks&user=' + username + '&from=' + firstDayOfWeek / 1000 + '&to' + Date.now() / 1000 + '&limit=1&' + apiKey + '&format=json')
                    ])

        .then(axios.spread((firstResponse, secondResponse, thirdResponse, forthResponse) => {
            var user = firstResponse.data.user;

            // Concatenate responses in one user object
            user["scrobblesThisYear"] = Object.values(secondResponse.data.recenttracks)[0].total;
            user["scrobblesThisMonth"] = Object.values(thirdResponse.data.recenttracks)[0].total;
            user["scrobblesThisWeek"] = Object.values(forthResponse.data.recenttracks)[0].total;

            // Add "now playing" value to user if he/she is listening rn
            if(Object.values(secondResponse.data.recenttracks.track[0])[1].nowplaying) {
                user["nowPlaying"] = {
                    artist: Object.values(secondResponse.data.recenttracks.track[0].artist)[1],
                    name: secondResponse.data.recenttracks.track[0].name
                };
            }

            dispatch(fetchUserSuccess(user));
        }))
        .catch(error => {
            console.log(error);
            dispatch(fetchUserError(error));});
    };
};