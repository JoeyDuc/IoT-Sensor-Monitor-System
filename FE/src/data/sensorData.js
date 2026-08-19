import dayjs from 'dayjs';

/**
 * Generate sensor readings for a given sensor type
 * @param {string} sensorName - e.g. "Temperature Sensor"
 * @param {string} type - "Temperature" | "Humidity" | "Light"
 * @param {number[]} baseValues - seed values to vary around
 * @param {string} unit - "°C" | "%" | "lux"
 * @param {dayjs.Dayjs} startDate
 * @param {number} daysCount
 * @param {number} readingsPerDay
 */
function generateReadings(sensorName, type, baseValues, unit, startDate, daysCount, readingsPerDay) {
  const readings = [];
  let id = 1;

  for (let d = 0; d < daysCount; d++) {
    for (let h = 0; h < readingsPerDay; h++) {
      const baseValue = baseValues[h % baseValues.length];
      const variance = (Math.random() - 0.5) * 2;
      // Clamp to 0 minimum (light can't be negative)
      const rawValue = parseFloat((baseValue + variance).toFixed(1));
      const value = Math.max(0, rawValue);
      const time = startDate
        .add(d, 'day')
        .add(h * Math.floor((24 * 60) / readingsPerDay), 'minute')
        .add(Math.floor(Math.random() * 59), 'second');

      readings.push({
        id: `${type.toLowerCase()}-${id++}`,
        sensor: sensorName,
        type,
        value,
        unit,
        time: time.format('DD/MM/YYYY HH:mm:ss'),
        timestamp: time.valueOf(),
      });
    }
  }

  return readings;
}

// Start: 7 days ago from 18/08/2026
const START_DATE = dayjs('2026-08-12');
const DAYS = 7;
const READINGS_PER_DAY = 24; // one per hour

const temperatureBaseValues = [26.8, 27.0, 27.2, 27.5, 27.8, 28.0, 28.2, 28.5, 28.7, 28.9,
  28.8, 28.6, 28.3, 28.1, 27.9, 27.7, 27.5, 27.3, 27.2, 27.0,
  26.9, 26.8, 26.7, 26.8];

const humidityBaseValues = [68, 68, 69, 70, 71, 72, 73, 73, 72, 71,
  70, 70, 69, 69, 70, 71, 72, 72, 71, 70,
  69, 68, 68, 68];

const lightBaseValues = [0, 0, 0, 0, 0, 50, 150, 300, 450, 520,
  570, 600, 610, 590, 560, 520, 460, 380, 280, 150,
  50, 10, 0, 0];

export const temperatureData = generateReadings(
  'Temperature Sensor', 'Temperature', temperatureBaseValues, '°C', START_DATE, DAYS, READINGS_PER_DAY
);

export const humidityData = generateReadings(
  'Humidity Sensor', 'Humidity', humidityBaseValues, '%', START_DATE, DAYS, READINGS_PER_DAY
);

export const lightData = generateReadings(
  'Light Sensor', 'Light', lightBaseValues, 'lux', START_DATE, DAYS, READINGS_PER_DAY
);

export const allSensorData = [...temperatureData, ...humidityData, ...lightData]
  .sort((a, b) => a.timestamp - b.timestamp);

// Latest values for dashboard summary cards
export const latestSensorSummary = {
  temperature: {
    value: temperatureData[temperatureData.length - 1]?.value ?? 28.5,
    unit: '°C',
    trend: '+2.4%',
    trendUp: true,
  },
  humidity: {
    value: humidityData[humidityData.length - 1]?.value ?? 72,
    unit: '%',
    trend: '-1.2%',
    trendUp: false,
  },
  light: {
    value: lightData[lightData.length - 1]?.value ?? 520,
    unit: 'lux',
    trend: '+5.1%',
    trendUp: true,
  },
};

// Chart data (last 24 readings each sensor, for dashboard charts)
export const dashboardChartData = {
  temperature: temperatureData.slice(-24).map((r) => ({
    time: r.time.split(' ')[1].substring(0, 5), // HH:mm
    value: r.value,
  })),
  humidity: humidityData.slice(-24).map((r) => ({
    time: r.time.split(' ')[1].substring(0, 5),
    value: r.value,
  })),
  light: lightData.slice(-24).map((r) => ({
    time: r.time.split(' ')[1].substring(0, 5),
    value: r.value,
  })),
};
