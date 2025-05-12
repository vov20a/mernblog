import { memo } from 'react';
import { IComment } from '../../types/IComment';

interface CommProps {
  commsArray: IComment[];
  postTitle: string | undefined;
  commentId?: string;
}

const DashCommentsForPost = ({ commentId, commsArray = [], postTitle }: CommProps) => {
  // console.log(commsArray);
  const parts: React.ReactNode[] = [
    <option
      key={'Level 0'}
      value=""
      className=" form-control form__input"
      style={{ height: 'auto', color: 'tomato' }}
    >
      Comment to post: {postTitle}
    </option>,
  ];
  for (const item of commsArray) {
    if (item.children.length > 0) {
      parts.push(
        <option
          key={item.id}
          value={item.id}
          className=" form-control form__input"
          style={{ height: 'auto', color: 'tomato' }}
          disabled={commentId === item.id ? true : false}
        >
          {`___${item.text.slice(0, 20)}`}
        </option>,
      );
    } else {
      parts.push(
        <option
          key={item.id}
          value={item.id}
          className=" form-control form__input"
          style={{ height: 'auto', color: 'tomato' }}
          disabled={commentId === item.id ? true : false}
        >
          {`___${item.text.slice(0, 20)}`}
        </option>,
      );
    }

    if (item.children.length > 0) {
      for (const child of item.children) {
        if (child.children.length > 0) {
          parts.push(
            <option
              key={child.id}
              value={child.id}
              className=" form-control form__input"
              style={{ height: 'auto', color: 'Highlight' }}
              disabled={commentId === child.id ? true : false}
            >
              {`______${child.text.slice(0, 20)}`}
            </option>,
          );
        } else {
          parts.push(
            <option
              key={child.id}
              value={child.id}
              className=" form-control form__input"
              style={{ height: 'auto', color: 'Highlight' }}
              disabled={commentId === child.id ? true : false}
            >
              {`______${child.text.slice(0, 20)}`}
            </option>,
          );
        }

        if (child.children.length > 0) {
          for (const cat of child.children) {
            parts.push(
              <option
                key={cat.id}
                value={cat.id}
                className=" form-control form__input"
                style={{ height: 'auto', color: 'green' }}
                disabled={true}
              >
                {`_________${cat.text.slice(0, 20)}`}
              </option>,
            );
          }
        }
      }
    }
  }
  return <>{parts}</>;
};

const memoizedComments = memo(DashCommentsForPost);

export default memoizedComments;
