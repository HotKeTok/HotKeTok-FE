import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_UTILITY_BILLS } from '../../../mocks/main/bills';
import styled from 'styled-components';
import { typo } from '../../../styles/tokens';
import { theme } from '../../../styles/theme';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#323232',
          color: '#fff',
          padding: '6px 8px',
          borderRadius: '4px',
          border: 'none',
          fontSize: '11px',
        }}
      >
        <p>{`${payload[0].value.toLocaleString()}원`}</p>
      </div>
    );
  }
  return null;
};

function GraphUtilityBills({ year }) {
  const chartData = MOCK_UTILITY_BILLS[year]
    .map(bill => ({
      name: `${bill.month}월`,
      value: bill.detail.gas.amount, // '가스' 요금으로 예시, 'value'로 바꾸면 총액
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));

  return (
    <Container>
      <Subtitle1 style={{ marginLeft: 20, marginBottom: 10 }}>
        {year}년 납부한 공과금 내역이에요. 🧐
      </Subtitle1>
      <div style={{ width: '100%', height: 150 }}>
        <ResponsiveContainer style={{ outline: 'none' }}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
            }}
            style={{ outline: 'none' }}
          >
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{
                fontFamily: 'Pretendard-Regular',
                fontSize: '11px',
                fontWeight: 400,
                color: theme.colors.grayscale[400],
              }}
            />
            <YAxis hide={true} domain={['dataMin - 7000', 'auto']} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: 'lightgrey', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Line
              type="linear"
              dataKey="value"
              stroke={theme.colors.brand.primary}
              strokeWidth={2}
              dot={{
                r: 3,
                strokeWidth: 2,
                fill: theme.colors.brand.primary,
                stroke: theme.colors.brand.primary,
              }} // 기본 점 스타일
              activeDot={{
                r: 6,
                fill: 'transparent',
                stroke: 'rgba(1, 210, 129, 0.3)',
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
}

export default GraphUtilityBills;

const Container = styled.div`
  padding: 17px 10px 0px 10px;
  background: #fafafb;
  border-radius: 20px;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
`;

const Subtitle1 = styled.div`
  ${typo('subtitle1')};
`;
