import React, { useEffect, useState } from 'react';
import { IComment } from '../../types/IComment';
import useAuth from '../../hooks/useAuth';
import { useAddNewCommentMutation } from '../../features/comments/commentsApiSlice';
import { IPostType } from '../../types/IPostType';
import { useCreateAndRemoveToast } from '../../hooks/useCreateAndRemoveToast';
import { PulseLoader } from 'react-spinners';

interface CommentsProps {
  post: IPostType | undefined;
  parent: IComment | undefined;
  setParent: (val: IComment | undefined) => void;
  parentNull: boolean;
  setParentNull: (val: boolean) => void;
  setRefetchComm: (val: boolean) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

const TEXT_REGEX = /^[?!.A-zА-я0-9\s]{3,}$/;

const CreateCommentsForm = ({
  post,
  parent,
  inputRef,
  setParent,
  parentNull,
  setParentNull,
  setRefetchComm,
}: CommentsProps) => {
  const { id: userId } = useAuth();

  const [validText, setValidText] = useState(false);
  const [textValue, setTextValue] = useState('');

  const [addComment, { data: commentData, isSuccess, isLoading, isError, error }] =
    useAddNewCommentMutation();

  useEffect(() => {
    setValidText(TEXT_REGEX.test(textValue));
  }, [textValue]);

  const changeParentNull = () => {
    setParent(undefined);
    setParentNull(true);
  };

  useEffect(() => {
    if (isSuccess) {
      setTextValue('');
      setParent(undefined);
      setParentNull(true);
      // refetch();
      setRefetchComm(true);
    }
  }, [isSuccess, setParent, setParentNull, setRefetchComm]);

  useEffect(() => {
    if (isError) {
      setTextValue(textValue);
    }
  }, [isError, textValue]);

  const canSave = [validText, post].every(Boolean) && !isLoading;

  const onCreateComment = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSave) {
      await addComment({
        text: textValue,
        user: userId,
        post: (post ? post._id : '') as string,
        parentComment: parent ? parent?._id : '',
      });
    }
  };

  const validTextClass = !validText ? 'form__input--incomplete' : '';

  useCreateAndRemoveToast(isError, error?.data?.message || error?.status, 'error');
  useCreateAndRemoveToast(isSuccess, commentData ? commentData?.message : '', 'success');

  let content = <></>;

  if (isLoading) content = <PulseLoader color={'#000'} />;
  // if (isError) content = <p className="errmsg">{error?.data?.message}</p>;
  else {
    content = (
      <form onSubmit={onCreateComment}>
        <div className="justif">
          <p className="parent-comment" onClick={changeParentNull}>
            {parent !== undefined &&
              'Parent Comment : ' + parent?.user.username + ' (click me to set null)'}
            {parentNull && 'Parent Comment : null'}
          </p>
        </div>
        <div className="comment">
          <input
            ref={inputRef !== undefined ? inputRef : undefined}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            type="text"
            placeholder="Comment"
            className={`comment  ${validTextClass}`}
          />
        </div>
        <div className="post">
          <input type="submit" value="Post" />
        </div>
      </form>
    );
  }
  return <>{content}</>;
};

export default CreateCommentsForm;
