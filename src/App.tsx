import React, {ChangeEvent, DetailedHTMLProps, HTMLAttributes, KeyboardEvent, useEffect, useRef, useState} from 'react';
import './App.css';

type MessageEventType = {
    userId: number,
    userName: string
    message: string
    photo: string
}

function App() {

    const messagesBlockRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessage] = useState<string>('');
    const [ws, setWS] = useState<WebSocket | null>(null);
    const [users, setUsers] = useState<MessageEventType []>([]);



    const ohChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.charCode === 13) {
            sendMessage()
            e.preventDefault()
        }
    }

    const sendMessage = () => {
        if( messages === '') {
            return
        }
        ws && ws.send(messages)
        setMessage('')
    }


    useEffect(() => {
        let localWS = new WebSocket("wss://social-network.samuraijs.com/handlers/ChatHandler.ashx")
        localWS.onmessage = (messageEvent) => {
            const newMessage = JSON.parse(messageEvent.data)
            setUsers(state => [...state,...newMessage])
            messagesBlockRef.current && messagesBlockRef.current.scrollTo(0, messagesBlockRef.current. scrollHeight)
        }
        setWS(localWS)

    }, [])

    return (
        <div className="App">
            <div className={'chat'}  ref={messagesBlockRef}>
                {
                    users.map((u, index) =>  {
                        return (
                            <div className={'wrapper'} key={index}>
                                <div>
                                    <img
                                        src={u.photo ? u.photo : "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"}
                                        alt="Picture"/>
                                </div>
                                <div>
                                    <h3>{u.userName}</h3>
                                    <span> {u.message} </span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

                <div className={'footer'}>
                    <div className={'wrapper'}>
                        <div>
                            <textarea value={messages} onChange={ohChangeHandler} onKeyPress={onKeyPressHandler} autoFocus/>
                        </div>
                        <div>
                            <button style={{margin: '15px'}} onClick={sendMessage}>Click</button>
                        </div>
                    </div>
                </div>
            </div>


    );
}

export default App;
