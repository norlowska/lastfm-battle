import { FETCH_USER_PENDING, FETCH_USER_SUCCESS, FETCH_USER_ERROR } from '../actions';

const initialState = {
    isPending: true,
    user1: {},
    user2: {},
    error: null
}

export const reducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_USER_PENDING:
            return {
                ...state,
                isPending: true
            }
        case FETCH_USER_SUCCESS:
            if(!state.user1.name) {
                return {
                    ...state,
                    user1: action.user
                }
            } else {
                return {
                    ...state,
                    isPending: false,
                    user2: action.user
                }
            }
        case FETCH_USER_ERROR:
            return {
                ...state,
                error: action.error
            }
        default:
            return state;
    }
}