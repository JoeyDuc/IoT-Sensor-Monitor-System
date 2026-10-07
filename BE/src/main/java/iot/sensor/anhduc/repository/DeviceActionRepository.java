package iot.sensor.anhduc.repository;

import iot.sensor.anhduc.entity.DeviceAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceActionRepository extends JpaRepository<DeviceAction, Long>, JpaSpecificationExecutor<DeviceAction> {

    Optional<DeviceAction> findTop1ByDeviceIdOrderByTimeDesc(Long deviceId);

    Optional<DeviceAction> findTop1ByDeviceNameOrderByTimeDesc(String deviceName);
}
