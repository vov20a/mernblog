import { IDataMessage } from './Chat';

interface IMessagesProp {
  state: IDataMessage[];
  name: string;
}

const Messages = ({ state, name }: IMessagesProp) => {
  return (
    <div className="messages">
      {state.map(({ user, message }, index) => {
        const itsMe = user.name.trim().toLowerCase() === name.trim().toLowerCase();
        const className = itsMe
          ? 'me'
          : user.name.trim().toLowerCase() === 'admin'
          ? 'admin'
          : 'user';

        return (
          <div key={index} className={`message ${className}`}>
            <span>
              {user.name}
              <div className="text">{message}</div>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
