import * as React from 'react';
import {
    getAxiosClient,
    getAxiosClientToken,
} from '../node_modules/axios-client-ts/dist/index';

//
const baseURL = 'https://react-django-heroku.herokuapp.com/';

//
const axiosClient = getAxiosClient();
axiosClient.defaults.baseURL = baseURL;

//
const axiosClientToken = getAxiosClientToken({
    urlRefreshToken: `${baseURL}api/account/refresh-token/`,
});
axiosClientToken.defaults.baseURL = baseURL;

//
export interface AppProps {}

//
function App({}: AppProps) {
    //
    React.useEffect(() => {
        handleLogin();
        // handleAxios();
    }, []);

    // ----

    //
    async function handleAxios() {
        axiosClient.defaults.headers.common['content-type'] =
            'application/json';
        const data = await axiosClient.get('api/city/city-no-token-l/');

        console.log(data);
    }

    //
    async function handleLogin() {
        const formData = new FormData();
        formData.append('username', 'axiosClient');
        formData.append('password', 'iloveyou1234');

        const res = await axiosClient.post('api/account/login/', formData);
        localStorage['access_token'] = res.data.access;
        // console.log(res.data);

        const res2 = await axiosClientToken.get(
            `api/profile/profile-r/${res.data.id}/`
        );
        console.log(res2.data);
    }

    //
    return <div></div>;
}

export default App;
