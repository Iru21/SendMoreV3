import axios from 'axios'
import config from '../utils/config'
export default async function send(hashes: string[], exts: string[]) {
    await axios.post(`http://127.0.0.1:${config.API_PORT}/send`, {hashes, exts},
    {
        headers: {
            'Authorization': 'key ' + localStorage.getItem('DS-api-key-wwx'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    return
}