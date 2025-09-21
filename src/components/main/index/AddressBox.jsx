import { color, typo } from '../../../styles/tokens';
import styled from 'styled-components';
import { Column } from '../../../styles/flex';
import { AUTH_TEXT } from '../../../constants/tenant/main';

export default function AddressBox({ address }) {
  return (
    <Container $gap={10}>
      <Subtitle1>{address}</Subtitle1>
      <Caption1 style={{ ...typo('caption1') }}>
        {AUTH_TEXT['black'].map((text, index) => (
          <div key={index}>{text}</div>
        ))}
        {AUTH_TEXT['primary'].map((text, index) => (
          <div key={index} style={{ color: '#01d281', marginTop: index === 0 ? 8 : 4 }}>
            {text}
          </div>
        ))}
      </Caption1>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <Tag>인증 중</Tag>
      </div>
    </Container>
  );
}

const Container = styled(Column)`
  background-color: #fff;
  padding: 20px 18px 16px 17px;
  border: 1px solid #f7f9fc;
  border-radius: 10px;
`;

const Subtitle1 = styled.div`
  ${typo('subtitle1')}
  color: #000;
`;

const Caption1 = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.600')};
`;

const Tag = styled.div`
  display: inline-flex;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;

  color: ${color('brand.primary')};
  border-radius: 30px;
  border: ${color('brand.primary')} 1px solid;

  ${typo('button1')}
`;
