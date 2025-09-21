import styled from 'styled-components';
import Logo from '../../../assets/common/BrandLogo.png';
import PageHeader from '../../../components/common/PageHeader';
import { Column, Row } from '../../../styles/flex';
import { Page } from '../../../styles/layout';
import { color, typo } from '../../../styles/tokens';
import ArrowRight from '../../../assets/common/icon-arrow-right.svg?react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Dropdown from '../../../components/common/DropDown';
import { DASHBOARD_ITEMS } from '../../../constants/landlord/main';

export default function MainTemplate() {
  const navigate = useNavigate();
  const USER_NAME = '집주인';

  // TODO : 실제 주소 리스트 get
  const menuItems = [
    { index: 1, label: '서울특별시 강남구 영동대로 112길 46' },
    { index: 2, label: '서울특별시 동작구 상도로 369 숭실대학교 일반대학원 웨스트민스터' },
    { index: 3, label: '서울특별시 강남구 영동대로 112길 46' },
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selected, setSelected] = useState(menuItems.find(item => item.index === 1).label);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const onRouteMyPage = () => {
    navigate('/my-page');
  };

  const items = Object.values(DASHBOARD_ITEMS);

  return (
    <Page>
      {/* 헤더 */}
      <PageHeader
        leftComponent={
          <Row $gap={10} $align={'flex-end'}>
            <img src={Logo} alt="Main Logo" style={{ width: 32, height: 27 }}></img>
            <BrandTitle>핫케톡</BrandTitle>
          </Row>
        }
      />
      <Content>
        {/* 마이페이지로 이동 */}
        <MyPageInfo $align={'flex-end'}>
          <MyPageTextGeneral>
            안녕하세요, <br /> <span style={{ fontWeight: '700' }}>{USER_NAME}</span> 님
          </MyPageTextGeneral>
          <Column
            $justify={'center'}
            style={{ height: 30, cursor: 'pointer' }}
            onClick={onRouteMyPage}
          >
            <StyleArrowRight />
          </Column>
        </MyPageInfo>

        {/* 주소 셀렉터 */}
        <Dropdown
          isOpen={isMenuOpen}
          toggleDropdown={toggleMenu}
          closeDropdown={closeMenu}
          selected={selected}
          setSelected={setSelected}
          items={menuItems}
        />

        {/* 메인 컨텐츠 */}
        <DashboardContainer>
          {items.map((item, index) => {
            // SVG 컴포넌트를 변수에 할당 (가독성 증진)
            const IconComponent = item.image;

            return (
              <Button
                key={index}
                onClick={() => navigate(item.route)}
                style={{ backgroundColor: item.backgroundColor }}
              >
                <Row $gap={14}>
                  <TextWrapper>
                    <Title>{item.text}</Title>
                    {/* description이 true일 때만 특정 텍스트를 보여주는 로직 (예시) */}
                    {item.description && <Description>3건 진행중</Description>}
                  </TextWrapper>
                  <Column $justify={'center'} style={{ height: 38, width: 20, cursor: 'pointer' }}>
                    <StyleArrowRight width={7} height={11} stroke="#565656" />
                  </Column>
                </Row>
                <Icon>
                  <IconComponent />
                </Icon>
              </Button>
            );
          })}
        </DashboardContainer>
      </Content>
    </Page>
  );
}

const Content = styled.div`
  flex: 1;
  background: #fff;
  padding: 24px;
  padding-top: 6px;
`;

const BrandTitle = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.000')};
  text-align: center;
`;

const MyPageInfo = styled(Row)`
  margin-bottom: 28;
`;

const MyPageTextGeneral = styled.div`
  ${typo('h2')};
  color: #000;
`;

const StyleArrowRight = styled(ArrowRight)`
  width: 7px;
  height: 12.5px;

  path {
    stroke: #323232;
  }
`;

const DashboardContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;

  margin-top: 10px;
`;

const Button = styled.button`
  border-radius: 20px;
  padding: 12px 8px 12px 16px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s;
  width: 166px;
  height: 140px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TextWrapper = styled.div`
  width: 80%;
`;

const Title = styled.div`
  ${typo('h1')};
  color: #000;
  word-break: keep-all;
`;

const Description = styled.p`
  font-size: 14px;
  color: #868e96;
  margin: 0;
`;

const Icon = styled.div`
  width: 50px;
  height: 50px;
  align-self: flex-end; // 아이콘을 오른쪽 아래로
`;
