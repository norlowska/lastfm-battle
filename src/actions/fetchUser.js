import {fetchUserPending, fetchUserSuccess, fetchUserError} from './index';
import axios from 'axios';

const apiUrl = 'https://ws.audioscrobbler.com/2.0/';
const apiKey = 'api_key=43d29806aac0cd9f7bac14612e06e46e';

const startOfWeek = (date) => {
    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
    var startOfWeek = new Date(date);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(diff);
    return startOfWeek;
};

export const fetchUser = (username) => {
    return function(dispatch) {
        dispatch(fetchUserPending());

        var current = new Date();
        var currentYear = current.getFullYear();
        var currentMonth = current.getMonth();
        var lastMonday = startOfWeek(current);

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
                          axios.get(apiUrl + '?method=user.getrecenttracks&user=' + username + '&from=' + lastMonday.getTime() / 1000 + '&to' + Date.now() / 1000 + '&limit=1&' + apiKey + '&format=json')
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