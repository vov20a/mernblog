import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

type ITarget = {
  target: {
    name: string;
    value: string;
  };
};

const FIELDS = {
  NAME: 'name',
  ROOM: 'room',
};

const Main = () => {
  const { username } = useAuth();

  const navigate = useNavigate();

  const { NAME, ROOM } = FIELDS;
  const [values, setValues] = useState({ [NAME]: username, [ROOM]: '' });

  const handleChange = ({ target: { value, name } }: ITarget) => {
    setValues({ ...values, [name]: value });
  };
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    //if name and room not false -  e.preventDefault();and go to chat
    const isDisabled = Object.values(values).some((v) => !v);
    if (isDisabled) e.preventDefault();
  };

  return (
    <section className="single-blog-area" style={{ marginTop: 50 }}>
      <div className="container">
        <div className="row  posts-align">
          <div className="col-md-12 blog-post-area posts-center">
            <div className="chat-main">
              <h1>CHAT</h1>
              <form className="chat-main__form ">
                <input
                  type="text"
                  className="chat-main__input"
                  name="room"
                  placeholder="Room"
                  value={values[ROOM]}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
                <Link
                  onClick={(e) => handleClick(e)}
                  to={`/chat/?name=${values[NAME]}&room=${values[ROOM]}`}
                  className="chat-main__link_button"
                >
                  {values[ROOM] ? (
                    <button className="chat-main__button" type="submit">
                      Submit
                    </button>
                  ) : (
                    <button
                      className="chat-main__button"
                      type="button"
                      onClick={() => navigate('/')}
                    >
                      Back
                    </button>
                  )}
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
