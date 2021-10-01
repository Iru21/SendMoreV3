import axios from 'axios'
export async function validate(key: string | null): Promise<boolean> {
    if(key == null) return false
    let data = {data: false}
    try {
        data = await axios.post(`http://${process.env.REACT_APP_API_P}:19713/validate`,
            {},
            {
                headers: {
                    'Authorization': 'key ' + key,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 1000
            }
        )
    } catch {
        data = await axios.post(`http://${process.env.REACT_APP_API_L}:19713/validate`,
            {},
            {
                headers: {
                    'Authorization': 'key ' + key,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                timeout: 1000
            }
        )
    }

    return data.data as boolean
}