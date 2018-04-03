import {createActions, handleActions} from 'redux-actions';

let defaultState = {
    token: undefined,
    otherConfig: {},
    appVersion: '1.0.0',
    registrationId:'',
};
export const {saveToken, clearToken, saveOtherConfig,saveSingleOtherConfig,saveAppVersion,saveRegistrationId} = createActions({
    SAVE_TOKEN: token => token,
    CLEAR_TOKEN: () => {},
    SAVE_OTHER_CONFIG: otherConfig => otherConfig,
    SAVE_SINGLE_OTHER_CONFIG: (key,value) => ({key,value}),
    SAVE_APP_VERSION: appVersion => appVersion,
    SAVE_REGISTRATION_ID: registrationId => registrationId,
});
const reducer = handleActions({
    SAVE_TOKEN: (state, action) => ({...state, token: action.payload}),
    CLEAR_TOKEN: (state, action) => ({...state, token: undefined, otherConfig: {}}),
    SAVE_OTHER_CONFIG: (state, action) => ({...state, otherConfig: action.payload}),
    SAVE_SINGLE_OTHER_CONFIG: (state, action) => {
        let newOtherConfig = Object.assign({},{...state.otherConfig,[action.payload.key]: action.payload.value});
        return Object.assign({},state,{otherConfig:newOtherConfig});
    },
    SAVE_APP_VERSION: (state, action) => ({...state, appVersion: action.payload}),
    SAVE_REGISTRATION_ID: (state, action) => ({...state, registrationId: action.payload}),
}, defaultState);

export default reducer;