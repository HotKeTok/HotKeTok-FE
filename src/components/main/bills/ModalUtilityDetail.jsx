import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { typo, color } from '../../../styles/tokens';
import { formatNumberWithCommas } from '../../../utils/number';
import CloseIcn from '../../../assets/common/icon-close.svg?react';
import { theme } from '../../../styles/theme';

const CustomizedLabel = ({ x, y, width, value }) => (
  <text
    x={x + width / 2}
    y={y}
    dy={-8}
    fill={color('grayscale.600')}
    textAnchor="middle"
    style={{ fontSize: 12, fontWeight: 400, fill: theme.colors.brand.primary }}
  >
    {formatNumberWithCommas(value)}원
  </text>
);

const RoundedBar = ({ x, y, width, height, fill }) => {
  const radius = 6;
  return <rect x={x} y={y} width={width} height={height} fill={fill} rx={radius} />;
};

// 증감 텍스트 헬퍼 함수
const formatIncrease = value => {
  if (value > 0) return <StatusText isIncrease>{formatNumberWithCommas(value)} 증가</StatusText>;
  if (value < 0) return <StatusText>{formatNumberWithCommas(Math.abs(value))} 감소</StatusText>;
  return null; // 변동 없음
};

export default function ModalUtilityDetail({ year, billData, onClose }) {
  if (!billData) {
    return (
      <ModalWrapper>
        <ModalHeader>
          <h4>공과금 내역</h4>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <p>선택된 공과금 내역이 없습니다.</p>
      </ModalWrapper>
    );
  }

  const { electricity, gas, water } = billData.detail;
  const chartData = [
    { name: '전기요금', amount: electricity.amount, increase: electricity.increase },
    { name: '수도요금', amount: water.amount, increase: water.increase },
    { name: '도시가스', amount: gas.amount, increase: gas.increase },
  ];

  const sortedData = [...chartData].sort((a, b) => b.amount - a.amount);
  const opacityMap = {
    [sortedData[0].name]: 1,
    [sortedData[1].name]: 0.5,
    [sortedData[2].name]: 0.3,
  };
  const baseRgbColor = '94, 224, 163';

  return (
    <ModalWrapper>
      <ModalHeader>
        <h4>
          {year}년 {billData.month}월 공과금
        </h4>
        <CloseButton onClick={onClose}>
          <CloseIcn />
        </CloseButton>
      </ModalHeader>

      <ChartSection>
        <p>이번 달 공과금 납부 내역이에요. 💰</p>
        <div style={{ width: '100%', height: '155px' }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              barSize={40}
              margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 400,
                  fontFamily: 'Pretendard-Regular',
                  fill: '#565656',
                }}
              />
              <YAxis hide={true} domain={[0, 'dataMax']} />

              <Bar dataKey="amount" label={<CustomizedLabel />} shape={<RoundedBar />}>
                {chartData.map(entry => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={`rgba(${baseRgbColor}, ${opacityMap[entry.name]})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartSection>

      <DetailList>
        {chartData.map(item => (
          <DetailItem key={item.name}>
            <Body1>{item.name}</Body1>
            <div>
              <Body1>{formatNumberWithCommas(item.amount)}원</Body1>
              <span>{formatIncrease(item.increase)}</span>
            </div>
          </DetailItem>
        ))}
      </DetailList>
    </ModalWrapper>
  );
}

const ModalWrapper = styled.div`
  background-color: white;
  padding: 20px 30px;
  border-radius: 30px;

  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h4 {
    ${typo('body2')};
    color: ${color('grayscale.400')};
  }
`;

const CloseButton = styled.div`
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChartSection = styled.div`
  background-color: #fafafb;
  border-radius: 20px;
  padding: 14px 22px 0px 22px;
  margin-bottom: 40px;
  p {
    ${typo('subtitle1')};
    margin-bottom: 20px;
  }
`;

const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  > div {
    text-align: right;
    span {
      ${typo('caption1')};
      font-weight: 400;
    }
  }
`;

const StatusText = styled.span`
  ${typo('caption1')};
  color: ${props => (props.isIncrease ? '#FF3F3F' : '#3C66FF')};
`;

const Body1 = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.800')};
`;
