import IcnAlarm from '../../assets/common/icon-alarm.svg?react';
import IcnAlarmActive from '../../assets/common/icon-alarm-active.svg?react';
import IcnAlarmWhite from '../../assets/common/icon-alarm-white.svg?react';
import IcnAlarmWhiteActive from '../../assets/common/icon-alarm-white-active.svg?react';
import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Alarm({ isLightVersion = false, color = 'default' }) {
  const navigate = useNavigate();
  const [hasAlarm, setHasAlarm] = useState(true); // TODO: API 연동 시 변경
  const onClick = () => navigate('/alarm');

  const AlarmIcon = color === 'white' ? IcnAlarmWhite : IcnAlarm;
  const AlarmActiveIcon = color === 'white' ? IcnAlarmWhiteActive : IcnAlarmActive;

  return (
    <AlarmContainer onClick={onClick}>
      <AbsoluteContainer style={{ top: 9, left: 15 }}>
        <AlarmIcon />
        <AbsoluteContainer>
          {hasAlarm && <AlarmActiveIcon style={{ bottom: 30 }} />}
        </AbsoluteContainer>
      </AbsoluteContainer>
    </AlarmContainer>
  );
}

const AlarmContainer = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const AbsoluteContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
