import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useCheckEmailMutation } from '../mails/mailsApiSlice';
import { PulseLoader } from 'react-spinners';
import { useCreateAndRemoveToast } from '../../hooks/useCreateAndRemoveToast';
import { Link } from 'react-router-dom';
import './login/login.css';

const ForgotPwd: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
    },
    //valid after change somthing in form
    mode: 'onChange',
  });
  const [checkEmail, { data, isSuccess, isLoading, isError, error }] = useCheckEmailMutation();

  const onSubmit = async (values: { email: string }) => {
    await checkEmail(values);
  };

  useCreateAndRemoveToast(isSuccess, data ? data?.message : 'Письмо отправлено', 'success');

  useCreateAndRemoveToast(isError, error?.data?.message || 'Server Error', 'error');

  let content = <></>;

  if (isLoading) content = <PulseLoader color={'#000'} className="pulse-loader" />;

  if (isError) content = <p className="errmsg ">{error?.data?.message}</p>;
  if (isSuccess)
    content = (
      <Row className="justify-content-md-center mt-3">
        <Col md={12}>
          <h3 className="title text-center">Mail was sended to your email</h3>
        </Col>
      </Row>
    );

  return (
    <div className="wrapper">
      <div className="container">
        <div className="login__inner">
          <Row className="justify-content-md-center">
            <Col>
              <h4 className="title text-center mb-5">
                <span className="pull-left ">
                  <span className="text">Restore</span>
                  <span className="line">
                    <strong> Password</strong>
                  </span>
                </span>
              </h4>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    required
                    isValid={isValid}
                    {...register('email', {
                      required: 'Укажите почту',
                      pattern: /\w+@\w+\.\w+/,
                    })}
                  />
                  <Form.Text className="text-muted">{errors.email?.message}</Form.Text>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col md={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="form-button">
                      <Button variant="secondary" type="submit" disabled={!isValid}>
                        Отправить email
                      </Button>
                    </div>
                    <Link to="/login">Back</Link>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          {content}
        </div>
      </div>
    </div>
  );
};

export default ForgotPwd;
