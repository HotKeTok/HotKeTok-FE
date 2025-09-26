import styled from 'styled-components';
import { color, typo } from '../../styles/tokens';
import Profile from '../../assets/common/icon-profile-default.svg?react';
import { Column, Row } from '../../styles/flex';
import ButtonRound from '../../components/common/ButtonRound';

/**
 *
 * @param {number}
 * @param {string} name
 * @param {string} address
 * @param {string} phone
 * @param {function} onConfirm
 * @param {function} onDelete
 * @returns
 */
export default function AuthItem({ id, name, address, phone, onConfirm, onDelete }) {
  return (
    <Container key={id}>
      <Row>
        {' '}
        <Profile width={24} height={24} />
        <Column style={{ marginLeft: 10 }}>
          <NameAddress>
            {name} - {address && `${address}`}
          </NameAddress>
          <Phone>{phone}</Phone>
        </Column>
      </Row>

      <Row $gap={10} style={{ height: '100%' }}>
        <ButtonRound
          filled={true}
          text="승인"
          onClick={onConfirm}
          width={68}
          height={44}
        ></ButtonRound>
        <ButtonRound
          filled={false}
          text="삭제"
          onClick={onDelete}
          width={68}
          height={44}
        ></ButtonRound>
      </Row>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 80px;
  background-color: white;
  border: 1px solid ${color('grayscale.200')};
  border-radius: 10px;

  padding: 16px 12px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NameAddress = styled.div`
  ${typo('subtitle1')}
  color: black;
`;

const Phone = styled.div`
  ${typo('body1')}
  color: ${color('grayscale.600')};
`;
