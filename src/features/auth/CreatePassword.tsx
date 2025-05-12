import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useCreatePasswordMutation } from '../mails/mailsApiSlice';
import { useNavigate, Link } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { useAppDispatch } from '../../app/store';
import { setCredentials } from './authSlice';
import { useCreateAndRemoveToast } from '../../hooks/useCreateAndRemoveToast';
import './login/login.css';

const CreatePassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [errMsg, setErrMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      password: '',
    },
    //valid after change somthing in form
    mode: 'onChange',
  });

  const [createPassword, { data, isLoading, isSuccess, isError, error }] =
    useCreatePasswordMutation();

  const onSubmit = async (values: { password: string }) => {
    try {
      const { accessToken } = (await createPassword(values).unwrap()) as unknown as {
        accessToken: string;
      };
      dispatch(setCredentials({ accessToken }));
      navigate('/');
    } catch (err: any) {
      if (!err.status) {
        setErrMsg('No Server Response');
      } else if (err.status === 400) {
        setErrMsg('Missing  Password');
      } else if (err.status === 401) {
        setErrMsg('Unauthorized ');
      } else if (err.status === 403) {
        setErrMsg('ActivationLink is wrong');
      } else if (err.status === 404) {
        setErrMsg('Not found ActivationLink');
      } else if (err.status === 408) {
        setErrMsg('Истекло время действия ссылки');
      } else {
        setErrMsg(err.data?.message);
      }
    }
  };

  useCreateAndRemoveToast(isSuccess, data ? data?.message : '', 'success');

  useCreateAndRemoveToast(isError, error?.data?.message || 'Server Error', 'error');

  const errClass = errMsg ? 'errmsg' : 'offscreen';

  let content = <></>;

  if (isLoading)
    content = (
      <Row>
        <Col md={12} style={{ display: 'flex', justifyContent: 'center', marginTop: 70 }}>
          <PulseLoader color={'#000'} className="pulse-loader" />
        </Col>
      </Row>
    );

  if (isError) content = <p className="errmsg ">{error?.data?.message}</p>;

  return (
    <div className="login">
      <div className="container">
        <div className="login__inner">
          <Row className="justify-content-md-center mb-2">
            <Col>
              <h4 className="title text-center mb-5">
                <span className="pull-left ">
                  <span className="text">Create New </span>
                  <span className="line">
                    <strong> Password</strong>
                  </span>
                </span>
              </h4>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password [4-12 (A-z0-9!@#$%)]</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    required
                    isValid={isValid}
                    {...register('password', {
                      required: 'Укажите пароль',
                      pattern: /^[A-z0-9!@#$%]{4,12}$/,
                    })}
                  />
                  <Form.Text className="text-muted" style={{ color: 'red' }}>
                    {errors.password?.message}
                  </Form.Text>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="form-button">
                      <Button variant="secondary" type="submit" disabled={!isValid}>
                        Отправить
                      </Button>
                    </div>
                    <Link to="/login">Back</Link>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          {isLoading && content}
          {isError && (
            <Row>
              <Col
                md={12}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {content}
                <p className={errClass} aria-live="assertive" style={{ margin: '0px auto' }}>
                  {errMsg}
                </p>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
