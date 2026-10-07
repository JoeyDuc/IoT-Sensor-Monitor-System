package iot.sensor.anhduc.service;

import iot.sensor.anhduc.entity.*;
import iot.sensor.anhduc.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DataInitService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitService.class);

    private final UserRepository userRepository;
    private final SensorRepository sensorRepository;
    private final DeviceRepository deviceRepository;
    private final DataSensorRepository dataSensorRepository;
    private final DeviceActionRepository actionRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitService(
            UserRepository userRepository,
            SensorRepository sensorRepository,
            DeviceRepository deviceRepository,
            DataSensorRepository dataSensorRepository,
            DeviceActionRepository actionRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.sensorRepository = sensorRepository;
        this.deviceRepository = deviceRepository;
        this.dataSensorRepository = dataSensorRepository;
        this.actionRepository = actionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        initUsers();
        initSensors();
        initDevices();
        initSampleSensorData();
        initSampleHistory();
    }

    private void initUsers() {
        if (userRepository.count() == 0) {
            log.info("Seeding default user...");
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("123456"))
                    .fullName("Nguyễn Anh Đức")
                    .email("admin@nexaiot.com")
                    .phone("+84 912 345 678")
                    .studentCode("B21DCCN001")
                    .className("D21CNPM01")
                    .github("https://github.com/JoeyDuc")
                    .figma("https://figma.com/@anhduc")
                    .postman("https://postman.com/workspace/iot")
                    .reportUrl("https://drive.google.com/report")
                    .avatarUrl("")
                    .role("ROLE_ADMIN")
                    .createdAt(LocalDateTime.now().minusDays(30))
                    .build();
            userRepository.save(admin);
        }
    }

    private void initSensors() {
        if (sensorRepository.count() == 0) {
            log.info("Seeding sensors...");
            sensorRepository.save(Sensor.builder().name("Temperature Sensor").type("Temperature").unit("°C").build());
            sensorRepository.save(Sensor.builder().name("Humidity Sensor").type("Humidity").unit("%").build());
            sensorRepository.save(Sensor.builder().name("Light Sensor").type("Light").unit("lux").build());
        }
    }

    private void initDevices() {
        if (deviceRepository.count() == 0) {
            log.info("Seeding devices...");
            deviceRepository.save(Device.builder()
                    .code("led1")
                    .name("Đèn LED 1 (Nhiệt độ)")
                    .type("LED")
                    .location("Phòng khách")
                    .status("ON")
                    .iconType("temperature")
                    .unit("lux")
                    .build());

            deviceRepository.save(Device.builder()
                    .code("led2")
                    .name("Đèn LED 2 (Độ ẩm)")
                    .type("LED")
                    .location("Phòng ngủ")
                    .status("OFF")
                    .iconType("humidity")
                    .unit("lux")
                    .build());

            deviceRepository.save(Device.builder()
                    .code("led3")
                    .name("Đèn LED 3 (Ánh sáng)")
                    .type("LED")
                    .location("Ban công")
                    .status("ON")
                    .iconType("light")
                    .unit("lux")
                    .build());

            deviceRepository.save(Device.builder()
                    .code("sensor-temp")
                    .name("Temperature Sensor")
                    .type("Temperature")
                    .location("Main Hall")
                    .status("ON")
                    .iconType("temperature")
                    .unit("°C")
                    .build());

            deviceRepository.save(Device.builder()
                    .code("sensor-humi")
                    .name("Humidity Sensor")
                    .type("Humidity")
                    .location("Main Hall")
                    .status("ON")
                    .iconType("humidity")
                    .unit("%")
                    .build());

            deviceRepository.save(Device.builder()
                    .code("sensor-light")
                    .name("Light Sensor")
                    .type("Light")
                    .location("Main Hall")
                    .status("OFF")
                    .iconType("light")
                    .unit("lux")
                    .build());
        }
    }

    private void initSampleSensorData() {
        if (dataSensorRepository.count() == 0) {
            log.info("Seeding initial sensor readings...");
            List<DataSensor> list = new ArrayList<>();
            LocalDateTime start = LocalDateTime.now().minusDays(5);

            double[] tempBases = {26.8, 27.2, 28.0, 28.7, 28.5, 27.9, 27.3, 26.8};
            double[] humiBases = {68.0, 70.0, 72.0, 73.0, 70.0, 69.0, 71.0, 68.0};
            double[] lightBases = {0.0, 150.0, 450.0, 610.0, 520.0, 280.0, 50.0, 0.0};

            for (int i = 0; i < 40; i++) {
                LocalDateTime t = start.plusHours(i * 3).plusMinutes(i % 15);
                double tVal = Math.round((tempBases[i % tempBases.length] + (Math.random() * 2 - 1)) * 10.0) / 10.0;
                double hVal = Math.round((humiBases[i % humiBases.length] + (Math.random() * 4 - 2)) * 10.0) / 10.0;
                double lVal = Math.max(0, Math.round(lightBases[i % lightBases.length] + (Math.random() * 50 - 25)));

                list.add(DataSensor.builder()
                        .sensorId(1L)
                        .sensorName("Temperature Sensor")
                        .sensorType("Temperature")
                        .value(tVal)
                        .unit("°C")
                        .connection("Online")
                        .status(DataSensor.calculateStatus("Temperature", tVal))
                        .time(t)
                        .build());

                list.add(DataSensor.builder()
                        .sensorId(2L)
                        .sensorName("Humidity Sensor")
                        .sensorType("Humidity")
                        .value(hVal)
                        .unit("%")
                        .connection("Online")
                        .status(DataSensor.calculateStatus("Humidity", hVal))
                        .time(t)
                        .build());

                list.add(DataSensor.builder()
                        .sensorId(3L)
                        .sensorName("Light Sensor")
                        .sensorType("Light")
                        .value(lVal)
                        .unit("lux")
                        .connection("Online")
                        .status(DataSensor.calculateStatus("Light", lVal))
                        .time(t)
                        .build());
            }

            dataSensorRepository.saveAll(list);
            log.info("Seeded {} sensor readings.", list.size());
        }
    }

    private void initSampleHistory() {
        if (actionRepository.count() == 0) {
            log.info("Seeding action history...");
            List<DeviceAction> list = new ArrayList<>();
            LocalDateTime now = LocalDateTime.now();

            list.add(DeviceAction.builder().deviceId(1L).deviceName("Đèn LED 1 (Nhiệt độ)").user("admin").action("TURN_ON").status("SUCCESS").time(now.minusHours(1)).build());
            list.add(DeviceAction.builder().deviceId(1L).deviceName("Đèn LED 1 (Nhiệt độ)").user("admin").action("TURN_OFF").status("SUCCESS").time(now.minusHours(2)).build());
            list.add(DeviceAction.builder().deviceId(2L).deviceName("Đèn LED 2 (Độ ẩm)").user("user01").action("TURN_ON").status("FAILED").time(now.minusHours(3)).build());
            list.add(DeviceAction.builder().deviceId(3L).deviceName("Đèn LED 3 (Ánh sáng)").user("admin").action("TURN_ON").status("SUCCESS").time(now.minusHours(4)).build());
            list.add(DeviceAction.builder().deviceId(1L).deviceName("Đèn LED 1 (Nhiệt độ)").user("admin").action("TURN_ON").status("SUCCESS").time(now.minusHours(5)).build());
            list.add(DeviceAction.builder().deviceId(2L).deviceName("Đèn LED 2 (Độ ẩm)").user("admin").action("TURN_OFF").status("SUCCESS").time(now.minusHours(6)).build());

            actionRepository.saveAll(list);
            log.info("Seeded {} history records.", list.size());
        }
    }
}
