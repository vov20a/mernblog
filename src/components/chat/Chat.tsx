import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import icon from '../../assets/images/arrow-icon.svg';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import Messages from './Messages';
import { socket } from '../../app/api/socket';

type ITarget = {
  target: {
    value: string;
  };
};
type IUsers = {
  name: string;
  room: string;
};
type IDataUsers = {
  data: {
    users: IUsers[];
  };
};
export type IDataMessage = {
  user: { name: string };
  message: string;
};

const Chat = () => {
  //search -string 'name=vova&room=11}'
  const { search } = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState<IDataMessage[]>([]);
  const [params, setParams] = useState({ name: '', room: '' });
  const [message, setMessage] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState<IUsers[]>([]);

  useEffect(() => {
    //get obj from search-string
    const searchParamsClass = new URLSearchParams(search);
    const searchParams: { [k: string]: string } = Object.fromEntries(searchParamsClass);

    setParams(searchParams as { name: string; room: string });
    socket.emit('join', searchParams);
  }, [search]);
  //events of send msg
  useEffect(() => {
    socket.on('message', ({ data }: { data: IDataMessage }) => {
      setState((_state: IDataMessage[]) => [..._state, data]);
    });
  }, []);
  //event about of users in room
  useEffect(() => {
    socket.on('room', ({ data: { users } }: IDataUsers) => {
      setUsers(users.filter((user) => user.name !== params.name));
    });
  }, [params]);
  // console.log(state);

  const leftRoom = () => {
    socket.emit('leftRoom', { params });
    navigate('/');
  };

  const handleChange = ({ target: { value } }: ITarget) => setMessage(value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message) return;
    // console.log(message);
    socket.emit('sendMessage', { message, params });

    setMessage('');
  };
  const onEmojiClick = ({ emoji }: EmojiClickData) => setMessage(`${message} ${emoji}`);

  return (
    <section className="single-blog-area" style={{ marginTop: 50 }}>
      <div className="container">
        <div className="row  posts-align">
          <div className="col-md-12 blog-post-area posts-center">
            <div className="chat-wrapper">
              <div className="chat-header">
                <div className="">{params.room}</div>
                <div className="">{params.name}</div>
                <div>
                  {users.length > 0
                    ? users.map((user, index) => <span key={index}> {user.name} </span>)
                    : 'nobody '}
                  <span>in room</span>
                </div>

                <button className="chat-button" onClick={leftRoom}>
                  Left the room
                </button>
              </div>
              <Messages state={state} name={params.name} />
              <form className="chat-form" onSubmit={(e) => handleSubmit(e)}>
                <input
                  type="text"
                  className="chat-input"
                  name="message"
                  placeholder="Write something....."
                  value={message}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
                <div className="chat-emoji ">
                  <img className="chat-image" src={icon} alt="" onClick={() => setOpen(!isOpen)} />
                  {isOpen && (
                    <div className="chat-epr_mw4zr1">
                      <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                  )}

                  <input
                    className="chat-input"
                    type="submit"
                    // onSubmit={handleSubmit}
                    value="Send a message"
                    disabled={!message}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Chat;
