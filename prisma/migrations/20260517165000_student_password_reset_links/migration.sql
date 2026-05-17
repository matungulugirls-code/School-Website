SET @columnExists := (
  SELECT COUNT(*)
  FROM `information_schema`.`COLUMNS`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'student_password_reset_requests'
    AND `COLUMN_NAME` = 'requestType'
);
SET @sql := IF(@columnExists = 0, 'ALTER TABLE `student_password_reset_requests` ADD COLUMN `requestType` VARCHAR(50) NOT NULL DEFAULT ''forgot''', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @columnExists := (
  SELECT COUNT(*)
  FROM `information_schema`.`COLUMNS`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'student_password_reset_requests'
    AND `COLUMN_NAME` = 'parentEmail'
);
SET @sql := IF(@columnExists = 0, 'ALTER TABLE `student_password_reset_requests` ADD COLUMN `parentEmail` VARCHAR(100) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @columnExists := (
  SELECT COUNT(*)
  FROM `information_schema`.`COLUMNS`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'student_password_reset_requests'
    AND `COLUMN_NAME` = 'tokenHash'
);
SET @sql := IF(@columnExists = 0, 'ALTER TABLE `student_password_reset_requests` ADD COLUMN `tokenHash` VARCHAR(191) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @columnExists := (
  SELECT COUNT(*)
  FROM `information_schema`.`COLUMNS`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'student_password_reset_requests'
    AND `COLUMN_NAME` = 'expiresAt'
);
SET @sql := IF(@columnExists = 0, 'ALTER TABLE `student_password_reset_requests` ADD COLUMN `expiresAt` DATETIME(3) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @columnExists := (
  SELECT COUNT(*)
  FROM `information_schema`.`COLUMNS`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'student_password_reset_requests'
    AND `COLUMN_NAME` = 'usedAt'
);
SET @sql := IF(@columnExists = 0, 'ALTER TABLE `student_password_reset_requests` ADD COLUMN `usedAt` DATETIME(3) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @columnExists := (
  SELECT COUNT(*)
  FROM `information_schema`.`COLUMNS`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'student_password_reset_requests'
    AND `COLUMN_NAME` = 'requestedByIp'
);
SET @sql := IF(@columnExists = 0, 'ALTER TABLE `student_password_reset_requests` ADD COLUMN `requestedByIp` VARCHAR(100) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @columnExists := (
  SELECT COUNT(*)
  FROM `information_schema`.`COLUMNS`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'student_password_reset_requests'
    AND `COLUMN_NAME` = 'requestedByUserAgent'
);
SET @sql := IF(@columnExists = 0, 'ALTER TABLE `student_password_reset_requests` ADD COLUMN `requestedByUserAgent` VARCHAR(255) NULL', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @indexExists := (
  SELECT COUNT(*)
  FROM `information_schema`.`STATISTICS`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'student_password_reset_requests'
    AND `INDEX_NAME` = 'student_password_reset_requests_requestType_idx'
);
SET @sql := IF(@indexExists = 0, 'CREATE INDEX `student_password_reset_requests_requestType_idx` ON `student_password_reset_requests` (`requestType`)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @indexExists := (
  SELECT COUNT(*)
  FROM `information_schema`.`STATISTICS`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'student_password_reset_requests'
    AND `INDEX_NAME` = 'student_password_reset_requests_tokenHash_idx'
);
SET @sql := IF(@indexExists = 0, 'CREATE INDEX `student_password_reset_requests_tokenHash_idx` ON `student_password_reset_requests` (`tokenHash`)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @indexExists := (
  SELECT COUNT(*)
  FROM `information_schema`.`STATISTICS`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'student_password_reset_requests'
    AND `INDEX_NAME` = 'student_password_reset_requests_expiresAt_idx'
);
SET @sql := IF(@indexExists = 0, 'CREATE INDEX `student_password_reset_requests_expiresAt_idx` ON `student_password_reset_requests` (`expiresAt`)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
