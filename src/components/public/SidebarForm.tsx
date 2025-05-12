import React, { useEffect, useState } from 'react';
import { useSendMessageMutation } from '../../features/mails/mailsApiSlice';
import { useCreateAndRemoveToast } from '../../hooks/useCreateAndRemoveToast';
import { PulseLoader } from 'react-spinners';
import useAuth from '../../hooks/useAuth';

const TEXT_REGEX = /^[A-zА-я0-9\s?]{3,40}/;

const SidebarForm = () => {
  const { username } = useAuth();

  const [text, setText] = useState<string>('');
  const [validText, setValidText] = useState(false);

  const [sendMessage, { data, isLoading, isSuccess, isError, error }] = useSendMessageMutation();

  useEffect(() => {
    setValidText(TEXT_REGEX.test(text));
  }, [text]);

  useEffect(() => {
    if (isSuccess) {
      setText('');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && text !== '') {
      setText(text);
    }
  }, [isError, text]);

  const onTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  const canSave = [validText].every(Boolean) && !isLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (canSave) {
      await sendMessage({ text, username });
      setText('');
    }
  };

  useCreateAndRemoveToast(isError, error?.data?.message, 'error');
  useCreateAndRemoveToast(isSuccess, data?.message, 'success');

  const validTextClass = !validText ? 'form__input--incomplete' : '';

  let content = <></>;
  if (isLoading) content = <PulseLoader color={'#000'} />;

  content = (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input
        type="text"
        className={`form-control ${validTextClass}`}
        placeholder="Text"
        value={text}
        onChange={onTextChanged}
      />
      <input type="submit" value="Отпрвить" disabled={!canSave} />
    </form>
  );
  return <>{content}</>;
};

export default SidebarForm;
