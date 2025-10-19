import styled from 'styled-components';
import { Column, Row } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import ArrowRight from '../../../assets/common/icon-arrow-right.svg?react';
import { useNavigate } from 'react-router-dom';
import { formatDateToYMD } from '../../../utils/dateFormat';

export default function NoticeBanner({ noticeList }) {
  const navigate = useNavigate();

  const handleBannerClick = () => {
    navigate('/notice');
  };

  return (
    <Container $gap={10}>
      <Row
        $align={'center'}
        $justify={'space-between'}
        style={{ cursor: 'pointer' }}
        onClick={handleBannerClick}
      >
        <H3>공지사항</H3>
        <ArrowRightStyled style={{ width: 6, height: 7 }} />
      </Row>
      {noticeList.map((item, index) => (
        <Row
          $justify={'space-between'}
          style={{
            borderBottom: item.isFix ? '1px solid #efefef' : 'none',
            paddingBottom: item.isFix ? 12 : 0,
          }}
          key={index}
        >
          <Body2>{item.title}</Body2>
          <Caption2>{formatDateToYMD(item.date)}</Caption2>
        </Row>
      ))}
    </Container>
  );
}

const Container = styled(Column)`
  padding: 16px 18px;

  border-radius: 2rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const H3 = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
`;

const Body2 = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;

const Caption2 = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.400')};
`;

const ArrowRightStyled = styled(ArrowRight)`
  path {
    stroke: #1f1f1f;
  }
`;
