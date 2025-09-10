import { color, typo } from "../../../styles/tokens"
import styled from "styled-components"
import { Column, Row } from "../../../styles/flex"
import { AUTH_TEXT } from "../../../constants/main"

export default function AuthModal({address}) {
    return (
        <Container $gap={10} >
            <H3>주소 인증 요청 중</H3>
            <Caption1>
                {AUTH_TEXT['black'].map((text, index) => <div key={index}>{text}</div>)}
                {AUTH_TEXT['primary'].map((text, index) => <div key={index} style={{color: '#01d281'}}>{text}</div>)}
            </Caption1>
            <Row $justify="space-between" $align="center" $fullWidth={true}>
                <Body2>{address}</Body2>
                 <Tag>인증 중</Tag>
            </Row>
        </Container>
    )
}

const Container = styled(Column)`
    padding-top: 30px;
    padding-left: 24px;
    padding-right: 24px;
`

const H3 = styled.div`
    ${typo('h3')}
    color: #000;
`

const Caption1 = styled.div`
    ${typo('caption1')}
`

const Body2 = styled.div`
    ${typo('body2')}    
    color: ${color('grayscale.600')};
`

const Tag= styled.div`
    display: inline-flex;
    padding: 6px 16px;
    justify-content: center;
    align-items: center;

    color: ${color('brand.primary')};
    border-radius: 30px;
    border: ${color('brand.primary')} 1px solid;

    ${typo('button3')}
`