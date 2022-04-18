import 'regenerator-runtime/runtime';
import axios from 'axios';
import { getAxiosClient } from './axiosClient';

//
let is_refreshing = false;

const getAxiosClientToken = ({
    urlRefreshToken,
    timeWaitRefresh = 1000,
}: {
    urlRefreshToken: string;
    timeWaitRefresh?: number;
}) => {
    //
    const axiosClient = getAxiosClient();

    //
    const RefreshToken = () =>
        axios({
            url: urlRefreshToken,
            method: 'POST',
        });

    //
    const TokenIsExpired = () => {
        const access_token = localStorage.access_token;
        const time_set = localStorage.time_set || 0;
        const time_now = new Date().getTime();
        const access_life = +localStorage.life_time || 0;
        //
        return time_now - time_set > access_life || !access_token;
    };

    //
    const GetRefreshToken = async () => {
        try {
            const res = await RefreshToken();
            const { access: access_token, life_time } = res.data;

            localStorage.access_token = access_token;
            localStorage.life_time = life_time;
            localStorage.time_set = new Date().getTime();

            return access_token;
        } catch (e) {
            throw e;
        }
    };

    //
    const waitRefreshToken = () =>
        new Promise((res) => {
            let times = 0;
            const time_max = Math.floor(timeWaitRefresh / 100);

            const interval = setInterval(() => {
                if (!is_refreshing) {
                    clearInterval(interval);

                    res('');
                }

                times++;

                if (times == time_max) {
                    clearInterval(interval);

                    throw new Error('Something went wrong');
                }
            }, 100);
        });

    // Axios request: Handle token here
    axiosClient.interceptors.request.use(async (config) => {
        const is_expired = TokenIsExpired();

        if (!is_expired) {
            config.headers.Authorization = `Bearer ${localStorage.access_token}`;

            return config;
        }

        if (!is_refreshing) {
            is_refreshing = true;

            const access_token = await GetRefreshToken();
            config.headers.Authorization = `Bearer ${access_token}`;

            is_refreshing = false;

            return config;
        } else {
            await waitRefreshToken();
            config.headers.Authorization = `Bearer ${localStorage.access_token}`;

            return config;
        }
    });

    // Axios response
    axiosClient.interceptors.response.use(
        (response) => {
            return response;
        },
        (err) => {}
    );

    //
    return axiosClient;
};

export default getAxiosClientToken;
