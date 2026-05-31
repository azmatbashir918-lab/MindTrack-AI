import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '../common/Card';

interface ChartProps {
  data: any[];
  type?: 'line' | 'bar';
  title?: string;
  xKey?: string;
  yKey?: string;
  color?: string;
}

const Chart: React.FC<ChartProps> = ({
  data,
  type = 'line',
  title,
  xKey = 'date',
  yKey = 'value',
  color = '#00E5FF',
}) => {
  return (
    <Card>
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={xKey} stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke={color}
                dot={{ fill: color, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={xKey} stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#E5E7EB' }}
              />
              <Legend />
              <Bar dataKey={yKey} fill={color} radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default Chart;
