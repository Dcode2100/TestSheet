// @ts-nocheck
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale } from 'chart.js';
import {Line, Bubble } from 'react-chartjs-2';
import 'chart.js/auto';


ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, RadialLinearScale);

// Sentiment gauge data
const gaugeData = {
  labels: ['Negative', 'Neutral', 'Positive'],
  datasets: [{
    data: [23],
    backgroundColor: ['#FF6384'],
    borderWidth: 0,
    circumference: 180,
    rotation: 270,
  }]
};

const gaugeOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: { display: false },
      grid: {
        circular: true,
        color: (context: { tick: { value: number } }) => {
          const value = context.tick.value;
          if (value < 33) return '#FF6384';
          if (value < 66) return '#36A2EB';
          return '#4BC0C0';
        }
      },
      pointLabels: { display: false }
    }
  }
};

// Monthly sentiment data
const monthlyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Sentiment Score',
    data: [45, 59, 80, 81, 56, 23],
    fill: true,
    borderColor: '#FF6384',
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    tension: 0.4
  }]
};

const monthlyOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: { raw: number }) => `Sentiment: ${context.raw}%`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(255, 99, 132, 0.1)'
      },
      ticks: {
        callback: (value: number) => `${value}%`
      }
    }
  }
};

// Enhanced keywords bubble data
const keywordsData = {
  datasets: [{
    label: 'Keywords',
    data: [
      { x: Math.random() * 100, y: Math.random() * 100, r: 20, keyword: 'service', count: 150, category: 'service' },
      { x: Math.random() * 100, y: Math.random() * 100, r: 25, keyword: 'quality', count: 200, category: 'quality' },
      { x: Math.random() * 100, y: Math.random() * 100, r: 30, keyword: 'delivery', count: 250, category: 'service' },
      { x: Math.random() * 100, y: Math.random() * 100, r: 35, keyword: 'food', count: 300, category: 'food' },
      { x: Math.random() * 100, y: Math.random() * 100, r: 40, keyword: 'price', count: 350, category: 'price' },
      { x: Math.random() * 100, y: Math.random() * 100, r: 15, keyword: 'menu', count: 100, category: 'food' },
      { x: Math.random() * 100, y: Math.random() * 100, r: 18, keyword: 'staff', count: 120, category: 'service' },
      { x: Math.random() * 100, y: Math.random() * 100, r: 22, keyword: 'taste', count: 180, category: 'food' },
      { x: Math.random() * 100, y: Math.random() * 100, r: 28, keyword: 'value', count: 220, category: 'price' },
      { x: Math.random() * 100, y: Math.random() * 100, r: 32, keyword: 'freshness', count: 260, category: 'quality' },
      { x: Math.random() * 100, y: Math.random() * 100, r: 24, keyword: 'ambiance', count: 190, category: 'quality' },
      { x: Math.random() * 100, y: Math.random() * 100, r: 26, keyword: 'portion', count: 210, category: 'food' }
    ],
    backgroundColor: (context: { dataIndex: number }) => {
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF99CC'];
      return colors[context.dataIndex % colors.length];
    },
    borderColor: 'rgba(255, 255, 255, 0.3)'
  }]
};

const bubbleOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: { raw: { keyword: any; count: any; }; }) => `${context.raw.keyword}: ${context.raw.count} mentions`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { display: false }
    },
    y: {
      grid: { display: false },
      ticks: { display: false }
    }
  }
};

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = React.useState('all');
  const [dateState, setDateState] = React.useState([
    {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 5)),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [sentimentThreshold, setSentimentThreshold] = React.useState(0);
  const [keywordFrequency, setKeywordFrequency] = React.useState(0);
  const [selectedCategories, setSelectedCategories] = React.useState(['all']);

  // Function to calculate date range based on selected period
const getDateRange = (period: string) => {
    const end = new Date();
    const start = new Date();
    
    switch (period) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(end.getMonth() - 3);
        break;
      default: // 'all'
        start.setMonth(end.getMonth() - 5);
    }
    
    return { start, end };
  };
  
  // Update date range when period changes
  React.useEffect(() => {
    const range = getDateRange(selectedPeriod);
    setDateState([{
      startDate: range.start,
      endDate: range.end,
      key: 'selection'
    }]);
  }, [selectedPeriod]);
  // Function to handle category selection
  const handleCategorySelect = (category: string) => {
    if (category === 'all') {
      setSelectedCategories(['all']);
    } else {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories.filter(c => c !== 'all'), category];
      setSelectedCategories(newCategories.length ? newCategories : ['all']);
    }
  };

  // Calculate date indices based on selected period
  const getDateIndices = () => {
    switch (selectedPeriod) {
      case 'week':
        return { start: 5, end: 5 };
      case 'month':
        return { start: 4, end: 5 };
      case 'quarter':
        return { start: 2, end: 5 };
      default: // 'all'
        return { start: 0, end: 5 };
    }
  };

  // Filter monthly data based on sentiment threshold
  const dateIndices = getDateIndices();
  const filteredMonthlyData = {
    ...monthlyData,
    labels: monthlyData.labels.slice(dateIndices.start, dateIndices.end + 1),
    datasets: [{
      ...monthlyData.datasets[0],
      data: monthlyData.datasets[0].data
        .slice(dateIndices.start, dateIndices.end + 1)
        .map(value => value >= sentimentThreshold ? value : null),
      spanGaps: true
    }]
  };

  // Filter keywords data based on frequency and categories
  const filteredKeywordsData = {
    datasets: [{
      ...keywordsData.datasets[0],
      data: keywordsData.datasets[0].data.filter(item => 
        item.count >= keywordFrequency &&
        (selectedCategories.includes('all') || selectedCategories.includes(item.category))
      )
    }]
  };

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Monthly Sentiment Trend</h2>
        <Line data={filteredMonthlyData} options={monthlyOptions} />
        <div className="text-center mt-4">
          <span className="text-2xl font-bold text-pink-500">23%</span>
          <p className="text-gray-600">Current Month Sentiment</p>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-700">Time Period</label>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 text-sm rounded ${selectedPeriod === 'week' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedPeriod('week')}
              >
                Last Week
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${selectedPeriod === 'month' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedPeriod('month')}
              >
                Last Month
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${selectedPeriod === 'quarter' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedPeriod('quarter')}
              >
                Last Quarter
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${selectedPeriod === 'all' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSelectedPeriod('all')}
              >
                All Time
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Sentiment Threshold</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={sentimentThreshold}
                onChange={(e) => setSentimentThreshold(parseInt(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-gray-600">{sentimentThreshold}%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Keyword Analysis</h2>
        <Bubble data={filteredKeywordsData} options={bubbleOptions} />
        <div className="text-center mt-4">
          <p className="text-gray-600">Size indicates mention frequency</p>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Minimum Frequency</label>
            <input
              type="range"
              min="0"
              max="350"
              value={keywordFrequency}
              onChange={(e) => setKeywordFrequency(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-600">{keywordFrequency}</span>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Categories</label>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 text-sm rounded ${selectedCategories.includes('all') ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handleCategorySelect('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${selectedCategories.includes('service') ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handleCategorySelect('service')}
              >
                Service
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${selectedCategories.includes('food') ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handleCategorySelect('food')}
              >
                Food
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${selectedCategories.includes('price') ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handleCategorySelect('price')}
              >
                Price
              </button>
              <button
                className={`px-3 py-1 text-sm rounded ${selectedCategories.includes('quality') ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handleCategorySelect('quality')}
              >
                Quality
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


