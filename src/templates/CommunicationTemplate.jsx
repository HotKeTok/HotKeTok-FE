import TopBar from "../components/common/TopBar";
import { Page, ScrollableContent } from "../styles/layout";
import styled from "styled-components";

export default function CommunicationTemplate () {
    return (
    <Page>
        <TopBar title="똑똑"/>
        <ScrollableContent>
            <Box/>
            <Box/>
            <Box/>
            <Box/>
            <Box/>
            <Box/>
            <Box/>
            <Box/>
        </ScrollableContent>
    </Page>)
}

const Box= styled.div`
    width: 100%;
    height: 100px;
    background-color: pink;
    
    margin: 10px;
`