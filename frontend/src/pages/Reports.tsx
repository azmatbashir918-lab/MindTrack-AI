import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/common/Layout';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');

  const reports = [
    {
      title: 'Weekly Habit Summary',
      period: 'Week of May 24-30, 2026',
      stats: {
        completed: '52/56',
        percentage: '92%',
        bestDay: 'Friday',
      },
      highlights: [
        'Completed 92% of planned habits',
        'Maintained 12-day streak on Morning Exercise',
        'Average mood score: 7.8/10',
      ],
      icon: '📅',
    },
    {
      title: 'Monthly Report',
      period: 'May 2026',
      stats: {
        completed: '178/210',
        percentage: '85%',
        improvement: '+5% vs April',
      },
      highlights: [
        'Total of 8 active habits',
        'Longest streak: 45 days (Reading)',
        'Most productive day: Tuesday',
      ],
      icon: '📊',
    },
  ];

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Reports</h1>
            <p className="text-gray-400 mt-2">Download and review your progress reports</p>
          </div>
          <div className="flex gap-2">
            {['weekly', 'monthly', 'yearly'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports.map((report, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <span className="text-2xl">{report.icon}</span>
                        {report.title}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1">{report.period}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(report.stats).map(([key, value]) => (
                      <div key={key} className="bg-gray-900/50 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 capitalize">{key}</p>
                        <p className="text-lg font-bold text-cyan-400 mt-1">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-2">Highlights</p>
                    <ul className="space-y-1">
                      {report.highlights.map((highlight, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                          <span className="text-cyan-400">✓</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      📥 Download PDF
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      📊 Share
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Export Options */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Export Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '📄', format: 'PDF', description: 'Formatted report for printing' },
              { icon: '📊', format: 'CSV', description: 'Data for spreadsheets' },
              { icon: '📈', format: 'Excel', description: 'Full workbook with charts' },
            ].map((option, idx) => (
              <div key={idx} className="p-4 bg-gray-900/50 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">{option.icon}</div>
                <p className="font-medium text-white">{option.format}</p>
                <p className="text-xs text-gray-400 mt-1">{option.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </Layout>
  );
};

export default Reports;
