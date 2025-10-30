import styled from 'styled-components';
import Logo from '../../../assets/common/BrandLogo.svg';
import PageHeader from '../../../components/common/PageHeader';
import { Column, Row } from '../../../styles/flex';
import { Page } from '../../../styles/layout';
import { color, typo } from '../../../styles/tokens';
import ArrowRight from '../../../assets/common/icon-arrow-right.svg?react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dropdown from '../../../components/common/DropDown';
import { DASHBOARD_ITEMS } from '../../../constants/landlord/main';
import { MAIN_DASHBOARD_ITEMS } from '../../../constants/landlord/main';
import useUserAddress from '../../../hooks/useUserAddress';

export default function MainTemplate({ updateCurrentAddress, authRequestCount }) {
  const { addressList } = useUserAddress();
  const navigate = useNavigate();
  const USER_NAME = '집주인';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selected, setSelected] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const onRouteMyPage = () => {
    navigate('/my-page');
  };

  const handleAddressChange = item => {
    if (!item || !item.label || !item.number) return; // '주소가 없습니다' 항목 선택 시 무시
    setSelected(item.label);
    updateCurrentAddress(item.label, item.number);
  };

  useEffect(() => {
    const currAddress = addressList.find(address => address.isCurrent);
    setSelected(currAddress ? currAddress.address : '주소가 없습니다');
  }, [addressList]);

  const DASH_ITEMS = DASHBOARD_ITEMS(authRequestCount);

  const filteredItems = Object.values(DASH_ITEMS).filter(item =>
    MAIN_DASHBOARD_ITEMS.includes(item.key)
  );

  const menuItems =
    addressList.length > 0
      ? addressList.map((address, index) => ({
          index: index + 1,
          label: address.address,
          number: address.number,
        }))
      : [{ index: 1, label: '주소가 없습니다' }];

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
          setSelected={handleAddressChange}
          items={menuItems}
        />

        {/* 메인 컨텐츠 */}
        <DashboardContainer>
          {filteredItems.map((item, index) => {
            const IconComponent = item.image;
            const isDisabled = item.key === 3 && authRequestCount === 0;
            const backgroundColor = isDisabled ? '#E6FBF3' : item.background;

            return (
              <Button
                key={index}
                onClick={() => navigate(item.route)}
                style={{
                  background: backgroundColor,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                }}
              >
                <Row $gap={14} style={{ height: '100%' }}>
                  <TextWrapper>
                    <Title>{item.text}</Title>
                    {item.description && authRequestCount > 0 && (
                      <Description>요청 {authRequestCount}건</Description>
                    )}
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
  width: 166px;
  height: 140px;

  position: relative;

  &:hover {
    ${props =>
      !props.disabled &&
      `

      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }`}
`;

const TextWrapper = styled.div`
  width: 80%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  ${typo('h1')};
  color: #000;
  word-break: keep-all;
`;

const Description = styled.div`
  max-width: 65%;
  background: #fff;
  padding: 3px 8px;

  display: inline-flex;
  justify-content: center;
  align-items: center;

  ${typo('button3')};
  color: ${color('brand.primary')};

  border-radius: 30px;
`;

const Icon = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;

  width: 50px;
  height: 50px;
  align-self: flex-end; // 아이콘을 오른쪽 아래로
`;
