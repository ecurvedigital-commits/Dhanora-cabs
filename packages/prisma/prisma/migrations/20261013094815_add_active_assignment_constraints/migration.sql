-- Prevent overlapping active vehicle assignments at the database level
CREATE UNIQUE INDEX idx_unique_active_vehicle_assignment 
ON vehicle_assignments (vehicle_id) 
WHERE status = 'ACTIVE';

-- Prevent overlapping active driver assignments at the database level
CREATE UNIQUE INDEX idx_unique_active_driver_assignment 
ON driver_assignments (driver_id) 
WHERE status = 'ACTIVE';