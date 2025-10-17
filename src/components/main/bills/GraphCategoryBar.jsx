import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import { formatNumberWithCommas } from '../../../utils/number';
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

export default function ChartCategoryBar({ year, month, chartData }) {
  const sortedData = [...chartData].sort((a, b) => b.amount - a.amount);

  const opacityMap = {
    [sortedData[0].name]: 1,
    [sortedData[1].name]: 0.5,
    [sortedData[2].name]: 0.3,
  };
  const baseRgbColor = '94, 224, 163';

  return (
    <Card aria-label={`${year}년 ${month}월 항목별 공과금 막대 차트`}>
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
    </Card>
  );
}

const Card = styled.div`
  background-color: #fafafb;
  border-radius: 20px;
  padding: 14px 22px 0px 22px;
  p {
    ${typo('subtitle1')};
    margin-bottom: 20px;
  }
`;
