import IcnAlarm from "../../assets/common/icon-alarm.svg?react"
import IcnAlarmActive from "../../assets/common/icon-alarm-active.svg?react"
import styled, { css } from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Alarm() {
    const navigate = useNavigate();
    const [hasAlarm, setHasAlarm] = useState(true);
    // TODO: 알림 상태 API 연동

    const onClick = () => {
        navigate('/main/alarm')
    }

    return (
        <AlarmContainer onClick={onClick}>
            <AbsoluteContainer>
                <AbsoluteContainer>
                    <IcnAlarm />
                </AbsoluteContainer>
                <AbsoluteContainer>
                    {hasAlarm && <IcnAlarmActive style={{ bottom: 30 }} />}    
                </AbsoluteContainer>
            </AbsoluteContainer>
        </AlarmContainer>
    )
}

const AlarmContainer = styled.div`
    position: relative;
    width: 18px;
    height: 20px;

    cursor: pointer;
`

const AbsoluteContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`