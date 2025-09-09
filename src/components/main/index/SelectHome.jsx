import ArrowDown from "../../../assets/common/icon-arrow-down.svg?react"
import { Row } from "../../../styles/flex"
import MainLogo from "../../../assets/common/BrandLogo.png"
import WhiteMainLogo from "../../../assets/common/BrandLogoWhite.png"
import { typo } from "../../../styles/tokens"
import styled from "styled-components"

export default function SelectHome ({homeTitle, isLightVersion=false}) {
    return (
        <Row $gap={10} $align={"center"}>
            <img src={isLightVersion ? WhiteMainLogo : MainLogo} alt="Main Logo" style={{width: 32, height: 27}}/>
            <Row $gap={6} $align={"center"} style={{cursor: 'pointer'}}>
                <Subtitle1 style={{color: isLightVersion? '#fff' : '#000'}}>{homeTitle}</Subtitle1>
                <ArrowDown />
            </Row>
        </Row>
    )
}

const Subtitle1= styled.span`
    ${typo('subtitle1')}
`