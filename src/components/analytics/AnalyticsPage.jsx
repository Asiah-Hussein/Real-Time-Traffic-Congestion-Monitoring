/**
 * AnalyticsPage Component
 * 
 * This component provides advanced data analysis and visualization for traffic data.
 * It includes multiple chart types (line, bar, pie) to help users understand traffic patterns,
 * compare locations, and analyze congestion distribution.
 * 
 * Design decisions:
 * - Uses a grid layout for responsive design across devices
 * - Provides filtering by location and time range for customized analysis
 * - Implements data export functionality for further offline analysis
 * - Handles loading and error states for better user experience
 * 
 * @component
 */
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, TrendingUp, BarChart as BarChartIcon, FileText, Download, Calendar } from 'lucide-react';
import { generateHistoricalData } from '../../services/mockData';

// Define LOCATIONS directly here to fix the import error
const LOCATIONS = {
  'city-center': {
    name: 'City Center',
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  'north-highway': {
    name: 'North Highway',
    coordinates: { lat: 51.5504, lng: -0.1277 }
  },
  'south-bridge': {
    name: 'South Bridge',
    coordinates: { lat: 51.4974, lng: -0.1278 }
  }
};

// Format data for export to ensure proper CSV structure
const formatDataForExport = (data) => {
  if (!Array.isArray(data)) {
    console.error("Data is not an array:", data);
    return [];
  }
  
  // Ensure all data has consistent properties
  return data.map(item => {
    // Make a copy to avoid modifying original data
    const exportItem = {...item};
    
    // Convert any complex objects to strings
    Object.keys(exportItem).forEach(key => {
      if (typeof exportItem[key] === 'object' && exportItem[key] !== null) {
        exportItem[key] = JSON.stringify(exportItem[key]);
      }
    });
    
    return exportItem;
  });
};

// CSV Export utility function - improved version
const convertToCSV = (data) => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return 'No data available for export';
  }
  
  // Format data for export
  const formattedData = formatDataForExport(data);
  
  // Get headers from the first object
  const headers = Object.keys(formattedData[0]);
  const csvRows = [];
  
  // Add headers row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of formattedData) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle strings with commas, quotes, etc.
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// Download data as CSV file - improved with error handling
const downloadCSV = (data, filename = 'traffic-data.csv') => {
  try {
    const csv = convertToCSV(data);
    if (!csv) {
      alert('No data available to export');
      return;
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    console.log(`Successfully exported ${filename}`);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    alert('Error exporting data. Please try again.');
  }
};

const AnalyticsPage = () => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [timeRange, setTimeRange] = useState('day');
  const [analyticsData, setAnalyticsData] = useState({
    hourlyData: [],
    locationComparison: [],
    peakTimes: [],
    congestionDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Generate analytics data based on selected parameters
    setLoading(true);
    setError(null);
    
    try {
      generateAnalyticsData(selectedLocation, timeRange);
      setLoading(false);
    } catch (err) {
      console.error("Error generating analytics data:", err);
      setError("Failed to generate analytics data. Please try again.");
      setLoading(false);
    }
  }, [selectedLocation, timeRange]);

  /**
   * Generates synthetic analytics data based on selected filters
   * In a production app, this would fetch from a real API
   */
  const generateAnalyticsData = (location, range) => {
    // Generate hourly average data
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const congestionFactor = getHourCongestionFactor(hour);
      const speedFactor = 1 / (congestionFactor > 0.5 ? congestionFactor : 0.5);
      
      return {
        hour: hour,
        hourFormatted: `${hour}:00`,
        averageCongestion: Math.min(100, 30 + (congestionFactor * 50)),
        averageSpeed: Math.max(10, 45 * speedFactor)
      };
    });

    // Generate location comparison data
    const locationComparison = Object.keys(LOCATIONS).map(locId => {
      let baseCongestion = locId === 'city-center' ? 65 : (locId === 'north-highway' ? 45 : 55);
      const randomFactor = 0.8 + (Math.random() * 0.4);
      
      return {
        locationId: locId,
        locationName: LOCATIONS[locId].name,
        averageCongestion: baseCongestion * randomFactor,
        maxCongestion: baseCongestion * randomFactor * 1.3,
        averageSpeed: 60 - (baseCongestion * randomFactor * 0.5)
      };
    });

    // Generate peak time data
    const peakTimes = [
      { name: 'Morning Rush (7-9)', value: 82 },
      { name: 'Midday (11-13)', value: 45 },
      { name: 'Evening Rush (16-18)', value: 78 },
      { name: 'Late Night (22-0)', value: 25 }
    ];

    // Generate congestion distribution
    const congestionDistribution = [
      { name: 'Low (<40%)', value: 35 },
      { name: 'Moderate (40-60%)', value: 40 },
      { name: 'High (60-80%)', value: 20 },
      { name: 'Severe (>80%)', value: 5 }
    ];

    setAnalyticsData({
      hourlyData,
      locationComparison,
      peakTimes,
      congestionDistribution
    });
  };

  /**
   * Returns a congestion factor based on time of day
   * Simulates real-world traffic patterns
   */
  const getHourCongestionFactor = (hour) => {
    // Morning peak
    if (hour >= 7 && hour <= 9) return 0.8 + (Math.random() * 0.4);
    // Evening peak
    if (hour >= 16 && hour <= 18) return 0.7 + (Math.random() * 0.4);
    // Midday
    if (hour >= 11 && hour <= 13) return 0.4 + (Math.random() * 0.3);
    // Night
    if (hour >= 22 || hour <= 5) return 0.1 + (Math.random() * 0.2);
    // Other times
    return 0.3 + (Math.random() * 0.3);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  /**
   * Handles CSV export for different data types
   * Formats and downloads the selected data as a CSV file
   */
  const handleExportCSV = (dataType) => {
    let dataToExport;
    let filename;
    
    switch(dataType) {
      case 'hourly':
        dataToExport = analyticsData.hourlyData;
        filename = 'hourly-traffic-patterns.csv';
        break;
      case 'location':
        dataToExport = analyticsData.locationComparison;
        filename = 'location-comparison.csv';
        break;
      case 'peaks':
        dataToExport = analyticsData.peakTimes;
        filename = 'peak-congestion-times.csv';
        break;
      case 'distribution':
        dataToExport = analyticsData.congestionDistribution;
        filename = 'congestion-distribution.csv';
        break;
      case 'all':
        // Combine all data with section headers
        dataToExport = [
          ...analyticsData.hourlyData.map(item => ({...item, dataType: 'Hourly Traffic'})),
          ...analyticsData.locationComparison.map(item => ({...item, dataType: 'Location Comparison'})),
          ...analyticsData.peakTimes.map(item => ({...item, dataType: 'Peak Times'})),
          ...analyticsData.congestionDistribution.map(item => ({...item, dataType: 'Congestion Distribution'}))
        ];
        filename = 'traffic-analytics-report.csv';
        break;
      default:
        alert('No data selected for export');
        return;
    }
    
    if (!dataToExport || dataToExport.length === 0) {
      alert('No data available to export');
      return;
    }
    
    downloadCSV(dataToExport, filename);
  };

  /**
   * Mock PDF export functionality
   * 
   * In a production environment, this would use a library like jsPDF or pdfmake
   * to generate a properly formatted PDF report with charts, tables, and analysis.
   * 
   * Example implementation would:
   * 1. Format the analytics data into report sections
   * 2. Generate charts as images
   * 3. Create a structured PDF with title, date, and branded header
   * 4. Add data tables and visualization images
   * 5. Include analysis text explaining the findings
   */
  const handleExportPDF = () => {
    // Show processing indicator to user
    alert('Generating PDF report...\n\nIn a production environment, this would create a formatted PDF using jsPDF or pdfmake libraries with proper charts, tables and analysis.');
    
    // Mock a processing delay
    setTimeout(() => {
      alert('PDF report generated successfully! In a real app, this would prompt a download.');
    }, 1500);
  };

  /**
   * Mock report scheduling functionality
   * 
   * In a production environment, this would:
   * 1. Open a modal to collect scheduling parameters (frequency, email, format)
   * 2. Connect to a backend service to set up the scheduled task
   * 3. Provide confirmation and management of scheduled reports
   */
  const handleScheduleReport = () => {
    alert('Report scheduling would allow users to receive automatic exports on a defined schedule (daily, weekly, monthly).');
    setTimeout(() => {
      alert('Report scheduled successfully! You would receive it via email based on your selected frequency in a production environment.');
    }, 1000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-2">Traffic Analytics</h1>
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Generating analytics data</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-2">Traffic Analytics</h1>
          <p className="text-gray-600">An error occurred</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-lg p-8 flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-800 text-center mb-4">{error}</p>
          <button 
            onClick={() => generateAnalyticsData(selectedLocation, timeRange)}
            className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Traffic Analytics</h1>
        <p className="text-gray-600">Advanced analytics and historical data analysis</p>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="all">All Locations</option>
            <option value="city-center">City Center</option>
            <option value="north-highway">North Highway</option>
            <option value="south-bridge">South Bridge</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>
      </div>

      {/* Analytics Cards - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Hourly Traffic Patterns */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold">Hourly Traffic Patterns</h2>
            </div>
            <button 
              onClick={() => handleExportCSV('hourly')}
              className="p-1 text-gray-500 hover:text-blue-500" 
              title="Export as CSV"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hourFormatted" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="averageCongestion" 
                  stroke="#8884d8" 
                  name="Congestion Level (%)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="averageSpeed" 
                  stroke="#82ca9d" 
                  name="Average Speed (mph)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Comparison */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold">Location Comparison</h2>
            </div>
            <button 
              onClick={() => handleExportCSV('location')}
              className="p-1 text-gray-500 hover:text-blue-500" 
              title="Export as CSV"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.locationComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="locationName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageCongestion" name="Avg Congestion (%)" fill="#8884d8" />
                <Bar dataKey="averageSpeed" name="Avg Speed (mph)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Analytics Cards - Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Peak Congestion Times */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold">Peak Congestion Times</h2>
            </div>
            <button 
              onClick={() => handleExportCSV('peaks')}
              className="p-1 text-gray-500 hover:text-blue-500" 
              title="Export as CSV"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.peakTimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Congestion Level (%)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Congestion Distribution */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold">Congestion Distribution</h2>
            </div>
            <button 
              onClick={() => handleExportCSV('distribution')}
              className="p-1 text-gray-500 hover:text-blue-500" 
              title="Export as CSV"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.congestionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.congestionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Export Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-4">Export Data</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => handleExportCSV('all')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export as CSV
          </button>
          <button 
            onClick={handleExportPDF}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export as PDF
          </button>
          <button 
            onClick={handleScheduleReport}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Schedule Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;