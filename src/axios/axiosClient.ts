import axios from 'axios';
import { stringify } from 'query-string';

//
export const csrftoken = () =>
    document.cookie &&
    document.cookie
        .split(';')
        .filter((str) => str.startsWith('csrftoken='))[0]
        .slice(10);

//
export const getAxiosClient = () =>
    axios.create({
        headers: {
            'X-CSRFToken': csrftoken(),
        },
        paramsSerializer: (params) => stringify(params),
    });
