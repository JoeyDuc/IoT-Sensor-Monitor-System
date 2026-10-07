package iot.sensor.anhduc.repository;

import iot.sensor.anhduc.entity.DataSensor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DataSensorRepository extends JpaRepository<DataSensor, Long>, JpaSpecificationExecutor<DataSensor> {

    Optional<DataSensor> findTop1BySensorTypeOrderByTimeDesc(String sensorType);

    List<DataSensor> findTop15BySensorTypeOrderByTimeDesc(String sensorType);

    List<DataSensor> findBySensorTypeAndTimeBetweenOrderByTimeAsc(
        String sensorType, LocalDateTime start, LocalDateTime end
    );

    @Query("SELECT d FROM DataSensor d WHERE d.sensorType = :sensorType ORDER BY d.time DESC")
    List<DataSensor> findRecentBySensorType(@Param("sensorType") String sensorType, Pageable pageable);
}
