import {createActions, handleActions} from 'redux-actions';

let defaultState = {
    searchInfo: [],
};

export const {saveSearch, clearSearch} = createActions({
    SAVE_SEARCH: searchInfo => searchInfo,
    CLEAR_SEARCH: (searchInfo) => {
    },
});

const reducer = handleActions({
    SAVE_SEARCH: (state, action) => {
        let result = [];
        let text = action.payload;

        if (state.searchInfo.length === 0) {
            result.push(text)
        } else {
            state.searchInfo.map((item) => {
                if (result.length >= 20) {
                    result.pop();
                }else {
                    if (!result.includes(text)) {
                        result.push(text);
                    }
                    if (!result.includes(item)) {
                        result.push(item);
                    }
                }
            })
        }
        return {...state, searchInfo: result}
    },
    CLEAR_SEARCH: (state, action) => ({
        ...state, searchInfo: []
    })
}, defaultState);

export default reducer;