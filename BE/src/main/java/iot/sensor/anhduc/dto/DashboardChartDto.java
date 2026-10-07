package iot.sensor.anhduc.dto;

import java.util.List;

public class DashboardChartDto {

    private List<ChartPoint> temperature;
    private List<ChartPoint> humidity;
    private List<ChartPoint> light;

    public DashboardChartDto() {
    }

    public DashboardChartDto(List<ChartPoint> temperature, List<ChartPoint> humidity, List<ChartPoint> light) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.light = light;
    }

    public List<ChartPoint> getTemperature() {
        return temperature;
    }

    public void setTemperature(List<ChartPoint> temperature) {
        this.temperature = temperature;
    }

    public List<ChartPoint> getHumidity() {
        return humidity;
    }

    public void setHumidity(List<ChartPoint> humidity) {
        this.humidity = humidity;
    }

    public List<ChartPoint> getLight() {
        return light;
    }

    public void setLight(List<ChartPoint> light) {
        this.light = light;
    }

    public static DashboardChartDtoBuilder builder() {
        return new DashboardChartDtoBuilder();
    }

    public static class DashboardChartDtoBuilder {
        private List<ChartPoint> temperature;
        private List<ChartPoint> humidity;
        private List<ChartPoint> light;

        public DashboardChartDtoBuilder temperature(List<ChartPoint> temperature) { this.temperature = temperature; return this; }
        public DashboardChartDtoBuilder humidity(List<ChartPoint> humidity) { this.humidity = humidity; return this; }
        public DashboardChartDtoBuilder light(List<ChartPoint> light) { this.light = light; return this; }

        public DashboardChartDto build() {
            return new DashboardChartDto(temperature, humidity, light);
        }
    }

    public static class ChartPoint {
        private String time;      // "HH:mm"
        private Double value;     // numeric reading
        private Long timestamp;   // epoch millis
        private String fullTime;  // "dd/MM/yyyy HH:mm:ss"

        public ChartPoint() {
        }

        public ChartPoint(String time, Double value, Long timestamp, String fullTime) {
            this.time = time;
            this.value = value;
            this.timestamp = timestamp;
            this.fullTime = fullTime;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public Double getValue() {
            return value;
        }

        public void setValue(Double value) {
            this.value = value;
        }

        public Long getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Long timestamp) {
            this.timestamp = timestamp;
        }

        public String getFullTime() {
            return fullTime;
        }

        public void setFullTime(String fullTime) {
            this.fullTime = fullTime;
        }

        public static ChartPointBuilder builder() {
            return new ChartPointBuilder();
        }

        public static class ChartPointBuilder {
            private String time;
            private Double value;
            private Long timestamp;
            private String fullTime;

            public ChartPointBuilder time(String time) { this.time = time; return this; }
            public ChartPointBuilder value(Double value) { this.value = value; return this; }
            public ChartPointBuilder timestamp(Long timestamp) { this.timestamp = timestamp; return this; }
            public ChartPointBuilder fullTime(String fullTime) { this.fullTime = fullTime; return this; }

            public ChartPoint build() {
                return new ChartPoint(time, value, timestamp, fullTime);
            }
        }
    }
}
