package iot.sensor.anhduc.dto;

public class SensorSummaryDto {

    private MetricInfo temperature;
    private MetricInfo humidity;
    private MetricInfo light;

    public SensorSummaryDto() {
    }

    public SensorSummaryDto(MetricInfo temperature, MetricInfo humidity, MetricInfo light) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.light = light;
    }

    public MetricInfo getTemperature() {
        return temperature;
    }

    public void setTemperature(MetricInfo temperature) {
        this.temperature = temperature;
    }

    public MetricInfo getHumidity() {
        return humidity;
    }

    public void setHumidity(MetricInfo humidity) {
        this.humidity = humidity;
    }

    public MetricInfo getLight() {
        return light;
    }

    public void setLight(MetricInfo light) {
        this.light = light;
    }

    public static SensorSummaryDtoBuilder builder() {
        return new SensorSummaryDtoBuilder();
    }

    public static class SensorSummaryDtoBuilder {
        private MetricInfo temperature;
        private MetricInfo humidity;
        private MetricInfo light;

        public SensorSummaryDtoBuilder temperature(MetricInfo temperature) { this.temperature = temperature; return this; }
        public SensorSummaryDtoBuilder humidity(MetricInfo humidity) { this.humidity = humidity; return this; }
        public SensorSummaryDtoBuilder light(MetricInfo light) { this.light = light; return this; }

        public SensorSummaryDto build() {
            return new SensorSummaryDto(temperature, humidity, light);
        }
    }

    public static class MetricInfo {
        private Double value;
        private String unit;
        private String trend;
        private Boolean trendUp;

        public MetricInfo() {
        }

        public MetricInfo(Double value, String unit, String trend, Boolean trendUp) {
            this.value = value;
            this.unit = unit;
            this.trend = trend;
            this.trendUp = trendUp;
        }

        public Double getValue() {
            return value;
        }

        public void setValue(Double value) {
            this.value = value;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }

        public String getTrend() {
            return trend;
        }

        public void setTrend(String trend) {
            this.trend = trend;
        }

        public Boolean getTrendUp() {
            return trendUp;
        }

        public void setTrendUp(Boolean trendUp) {
            this.trendUp = trendUp;
        }

        public static MetricInfoBuilder builder() {
            return new MetricInfoBuilder();
        }

        public static class MetricInfoBuilder {
            private Double value;
            private String unit;
            private String trend;
            private Boolean trendUp;

            public MetricInfoBuilder value(Double value) { this.value = value; return this; }
            public MetricInfoBuilder unit(String unit) { this.unit = unit; return this; }
            public MetricInfoBuilder trend(String trend) { this.trend = trend; return this; }
            public MetricInfoBuilder trendUp(Boolean trendUp) { this.trendUp = trendUp; return this; }

            public MetricInfo build() {
                return new MetricInfo(value, unit, trend, trendUp);
            }
        }
    }
}
