import { typo } from "../../styles/tokens"
import Alarm from "./Alarm"
import styled from "styled-components"

export default function PageHeader({leftComponent, isLightVersion=false}) {
    return (
        <Container>
            {leftComponent}
            <Alarm isLightVersion={isLightVersion} />
        </Container>
    )
}

const Container = styled.div`
    width: auto;
    padding: 28px 13px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    ${typo('subtitle1')}
`