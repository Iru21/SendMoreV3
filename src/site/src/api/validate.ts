import axios from 'axios'
export async function validate(key: string | null): Promise<boolean> {
    if(key == null) return false
    const data = await axios.post(`http://127.0.0.1:19713/validate`,
        {},
        {
            headers: {
                'Authorization': 'key ' + key,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )

    return data.data as boolean
}