import PageHeader from "../../components/common/PageHeader";
import styled from "styled-components";
import SelectHome from "../../components/main/index/SelectHome";
import { Page } from "../../styles/layout";
import { typo } from "../../styles/tokens";
import { Column, Row } from "../../styles/flex";
import RepairBanner from "../../components/repair/RepairBanner"
import ArrowRight from "../../assets/common/icon-arrow-right.svg?react"
import { useNavigate } from "react-router-dom";
import NoticeBanner from "../../components/main/index/NoticeBanner";

/**
 * @function MainTemplate
 * @param {string} address - 사용자 주소
 * @param {object} utilityBill - 공과금 정보
 * @param {object} commonBill - 공동 관리비 정보
 * @returns 
 */
export default function MainTemplate({address, utilityBill, commonBill}) {
  const navigate = useNavigate();

  const handleBillClick = () => {
      navigate('/main/bills');
  }

  return (
    <Container $scroll={true}>

      <ColorBackground>
      <PageHeader isLightVersion={true} leftComponent={<SelectHome homeTitle="우리집" isLightVersion={true}/>}/>
      <Content>
        <H3 style={{color: '#fff', marginBottom: 16}}>{address}</H3>

        <Row $justify={'flex-end'} style={{marginBottom: 4}}>
           <Row $gap={6} $align={"center"} style={{cursor: 'pointer'}} onClick={handleBillClick}>
            <Button2 style={{color: '#fff'}}>내역 보기</Button2>
            <ArrowRight style={{width: 4, height: 7}}/>
         </Row>
        </Row>

        <Row $justify={'space-between'}>
          <Subtitle1 style={{color: '#fff'}}>공과금</Subtitle1>
          <H3 style={{color: '#fff'}}>{utilityBill}원</H3>
        </Row>

         <Row $justify={'space-between'}>
          <Subtitle1 style={{color: '#fff'}}>공과금</Subtitle1>
          <H3 style={{color: '#fff'}}>{commonBill}원</H3>
        </Row>

      </Content>
      </ColorBackground>

     <BottomContent $overlap={24} $gap={24}>
        <NoticeBanner/>
        <RepairBanner/>
      </BottomContent>
    </Container>
  );
}

const Container = styled(Page)`
  width: 100%;
`

const ColorBackground = styled.div`
  background: linear-gradient(180deg, #23DD95 42.31%, #36926F 100%);
  padding-bottom: 24px;
 `;

const Content = styled.div`
  padding: 0 16px;  
  padding-bottom: 18px;
  
`

const BottomContent = styled(Column)`
  --ov: ${({ $overlap = 16 }) =>
    typeof $overlap === 'number' ? `${$overlap}px` : $overlap};

  position: relative;
  z-index: 1; /* 위로 */
  margin-top: calc(-1 * var(--ov));         
  padding: calc(var(--ov) + 16px) 16px 16px;  

  border-radius: 30px 30px 0 0;
  background: #fff;

`;

const H3 = styled.div`
  ${typo('h3')}
`

const Subtitle1 = styled.div`
  ${typo('subtitle1')}
`

const Button2 = styled.div`
  ${typo('button2')}
`