import React, {useState} from 'react'
import './css/App.css'
import Logo from './assets/favicon.png'

import toast from './utils/toast'
import fileListToBase64 from './utils/fileListToBase64'
import getFileExtensions from './utils/getFileExtensions'
import { validate } from './api/validate'

import {sha256} from 'js-sha256'
import send from './api/send'

function App() {

    const [selectedFiles, setSelectedFiles] = useState()
    const [fileCount, setFileCount] = useState(0)
    const [apiKeyInputValue, setApiKeyInputValue] = useState("");

    const selectFileHandler = (event: any) => {
        const localFiles = event.target.files
        const localFileCount = event.target.files.length
        if(localFileCount > 30) {
            event.target.value = ''
            setSelectedFiles(undefined)
            setFileCount(0)
            toast("ERROR", `File count bigger than 30! Clearing input...`)
        } else {
            setSelectedFiles(localFiles)
            setFileCount(localFileCount)
            toast("SUCCESS", `Successfull selection! ${localFileCount} file${localFileCount !== 1 ? "s" : ""} selected.`)
        }
	}

    const clearApiKeyInput = (event: any) => {
        console.log(process.env)
        if(apiKeyInputValue !== '') {
            setApiKeyInputValue("")
            toast("SUCCESS", `Cleared input!`)
        }
    }

    const clearFileInput = (event: any) => {
        if(fileCount > 0) {
            setSelectedFiles(undefined)
            setFileCount(0)
            toast("SUCCESS", `Cleared selection!`)
        }
    }

    const apiKeyHandler = (event: any) => {
        setApiKeyInputValue(event.target.value)
    }

    const resetApiKey = (event: any) => {
        localStorage.clear()
        toast("SUCCESS", `API KEY has been cleared!`)
    }

    const handleSend = async (event: any) => {
        if(!selectedFiles) return toast("ERROR", "No files selected!")
        const list: FileList = selectedFiles
        if(list.length > 30) return toast("ERROR", `File limit exceeded! (Max 30)`)

        const [bases, skips] = fileListToBase64(list, 8)
        const exts = getFileExtensions(list, skips)

        const apiKey = localStorage.getItem('DS-api-key-wwx')

        const isValid = await validate(apiKey)
        if(!isValid) {
            toast("ERROR", "No valid API key found in storage! Checking input...")
            const isValidFromInput = await validate(sha256(apiKeyInputValue))
            if(!isValidFromInput) return toast("ERROR", "Invalid API key provided!")
            localStorage.setItem('DS-api-key-wwx', sha256(apiKeyInputValue))
            toast("SUCCESS", "Sent!")
            return send(bases, exts)
        }
        toast("SUCCESS", "Sent!")
        return send(bases, exts)
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={Logo} id="hl" alt="Logo"/><p>Send More</p>
            </header>
            <div className="content">
                <div className="pickerWrapper">
                    <button type="button" className="clearFileInput" onClick={clearFileInput}>x</button>
                    <label className="pickerButton" htmlFor="upload">Upload</label>
                    <input id="upload" className="picker" type="file" name="file" accept="image/png, image/jpg, image/jpeg, image/gif" multiple={true} onChange={selectFileHandler} />
                    <p id="fc">{fileCount} file{fileCount !== 1 ? "s" : ""} selected</p>
                </div>
                <div className="apiKeyWrapper">
                    <form>
                        <p>API KEY</p>
                        <div>
                            <input type="password" value={apiKeyInputValue} className="apiKeyInput" name="apikey" onChange={apiKeyHandler} />
                            <button type="button" className="clearApiKeyInput" onClick={clearApiKeyInput}>x</button>
                        </div>
                    </form>
                </div>
                <div className="sendWrapper">
                    <form>
                        <div>
                            <button type="button" className="sendButton" onClick={handleSend}>Send</button>
                        </div>
                    </form>
                </div>
                <div className="resetApiKeyWrapper">
                    <form>
                        <div>
                            <button type="button" className="resetApiKeyButton" onClick={resetApiKey}>Reset API KEY</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;
