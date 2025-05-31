import { Link } from 'react-router-dom';
import { memo, useState } from 'react';
import { IVideoType } from '../../../types/IVideoType';
import { Button } from 'react-bootstrap';
import DashModal from '../../../components/dash/DashModal';

type VideoProps = {
  video: IVideoType | undefined;
  number: number;
  onDeleteVideoClicked?: ((id: string) => Promise<void>) | undefined;
};

const DashVideo = ({ video, number, onDeleteVideoClicked }: VideoProps) => {
  const [isShow, setShow] = useState(false);

  const onDeleteVideo = () => {
    setShow(true);
  };
  if (video) {
    return (
      <>
        <tr>
          <td>{number}</td>
          <td>{video.title.slice(0, 20)}</td>
          <td>{video.videoUrl.replace('https://www.youtube.com/embed/', '')}</td>
          <td>
            {new Date(video.createdAt).toLocaleString('ru-RU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </td>
          <td>
            {new Date(video.updatedAt).toLocaleString('ru-RU', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </td>

          <td className="project-actions">
            <Link
              className="btn btn-info btn-sm"
              to={`/dash/videos/edit/${video.id}`}
              style={{ color: 'white' }}
            >
              <i className="fas fa-pencil-alt"></i>
              Edit
            </Link>
            <Button
              onClick={onDeleteVideo}
              className="btn btn-danger btn-sm"
              style={{ color: 'white' }}
            >
              <i className="fas fa-trash"></i>
              Delete
            </Button>
          </td>
        </tr>
        {onDeleteVideoClicked !== undefined && (
          <DashModal
            isShow={isShow}
            setShow={(show) => setShow(show)}
            data={video.videoUrl.replace('https://www.youtube.com/embed/', '')}
            id={video.id ?? ''}
            onDeleteClicked={(id) => onDeleteVideoClicked(id)}
          />
        )}
      </>
    );
  } else return null;
};
const memoizedVideo = memo(DashVideo);
export default memoizedVideo;
