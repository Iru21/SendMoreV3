import axios from 'axios'
export default async function send(hashes: string[], exts: string[]) {
    try {
        await axios.post(`http://${process.env.REACT_APP_API_P}:19713/send`, {hashes, exts},
        {
            headers: {
                'Authorization': 'key ' + localStorage.getItem('DS-api-key-wwx'),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 1000
        })
    } catch {
        await axios.post(`http://${process.env.REACT_APP_API_L}:19713/send`, {hashes, exts},
        {
            headers: {
                'Authorization': 'key ' + localStorage.getItem('DS-api-key-wwx'),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 1000
        })
    }
    return
}