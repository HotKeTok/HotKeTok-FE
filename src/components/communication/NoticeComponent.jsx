import styled from 'styled-components';
import { typo } from '../../styles/tokens';
import NoticeItem from '../main/notice/NoticeItem';
import { useNavigate } from 'react-router-dom';

/**
 * @function NoticeComponent
 * @description 공지사항을 4가지 보여주고, 라우트를 지원
 */
export default function NoticeComponent({ notices }) {
  const navigate = useNavigate();

  const onNoticeDetailRoute = noticeId => {
    if (noticeId) navigate(`/notice/${noticeId}`); // 특정 공지사항 페이지로 이동
    else navigate(`/notice`); // 전체 공지사항으로 이동
  };

  return (
    <NoticeWrapper>
      <NoticeTitle>
        <Subtitle1>공지사항</Subtitle1>
        <Button3 style={{ padding: 10, color: '#9a9a9a' }} onClick={() => onNoticeDetailRoute()}>
          전체 보기
        </Button3>
      </NoticeTitle>
      {notices.slice(0, 4).map(notice => (
        <div
          key={notice.id}
          style={{ cursor: 'pointer' }}
          onClick={() => onNoticeDetailRoute(notice.id)}
        >
          <NoticeItem
            title={notice.title}
            date={notice.date}
            writer={notice.writer}
            pinned={notice.pinned}
            latest={notice.latest}
          />
        </div>
      ))}
    </NoticeWrapper>
  );
}

const NoticeWrapper = styled.div`
  background-color: #f5f6f6;
  border-radius: 10px;
  padding: 16px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 6px;
`;

const NoticeTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;
const Subtitle1 = styled.div`
  ${typo('subtitle1')};
`;

const Button3 = styled.div`
  ${typo('button3')};
  padding: 10px;
  cursor: pointer;
`;
