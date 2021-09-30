import toaster from "toasted-notes"
import "toasted-notes/src/styles.css"

export default function generateToast(type: "SUCCESS" | "ERROR", message: string) {

    let color: string = ""
    switch (type) {
        case "SUCCESS":
            color = 'lightgreen'
            break
        case "ERROR":
            color = 'crimson'
            break
    }

    const containerStyle: any = {
        textDecoration: "none",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        margin: 0,
        padding: 0
    }

    const innerStyle: any = {
        color: 'white',
        backgroundColor: '#4e535e',
        borderRadius: '30px',
        borderColor: color,
        borderStyle: 'solid',
        borderWidth: '1px',
        padding: '17px',
        marginRight: '35px',
        marginBottom: '25px',
        fontSize: '20px',
        display: "inline-block",
        whiteSpace: "nowrap"
    }

    toaster.notify(({ onClose }) => (
        <button style={containerStyle} onClick={onClose}>
            <div style={innerStyle}>{message}</div>
        </button>
    ), {position: "bottom-right"});
    return
}