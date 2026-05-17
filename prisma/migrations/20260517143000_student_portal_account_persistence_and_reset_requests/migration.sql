SET @studentPortalAccountFk := (
  SELECT `CONSTRAINT_NAME`
  FROM `information_schema`.`KEY_COLUMN_USAGE`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'student_portal_accounts'
    AND `COLUMN_NAME` = 'admissionNumber'
    AND `REFERENCED_TABLE_NAME` = 'students'
  LIMIT 1
);

SET @dropStudentPortalAccountFkSql := IF(
  @studentPortalAccountFk IS NULL,
  'SELECT 1',
  CONCAT('ALTER TABLE `student_portal_accounts` DROP FOREIGN KEY `', @studentPortalAccountFk, '`')
);

PREPARE dropStudentPortalAccountFkStmt FROM @dropStudentPortalAccountFkSql;
EXECUTE dropStudentPortalAccountFkStmt;
DEALLOCATE PREPARE dropStudentPortalAccountFkStmt;

ALTER TABLE `student_portal_accounts`
  ADD COLUMN `firstName` VARCHAR(100) NULL,
  ADD COLUMN `middleName` VARCHAR(100) NULL,
  ADD COLUMN `lastName` VARCHAR(100) NULL,
  ADD COLUMN `fullName` VARCHAR(255) NULL,
  ADD COLUMN `form` VARCHAR(20) NULL,
  ADD COLUMN `stream` VARCHAR(50) NULL,
  ADD COLUMN `email` VARCHAR(100) NULL,
  ADD COLUMN `parentPhone` VARCHAR(20) NULL,
  ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'active';

UPDATE `student_portal_accounts` AS spa
LEFT JOIN `students` AS s ON s.`admissionNumber` = spa.`admissionNumber`
SET
  spa.`firstName` = COALESCE(spa.`firstName`, s.`firstName`),
  spa.`middleName` = COALESCE(spa.`middleName`, s.`middleName`),
  spa.`lastName` = COALESCE(spa.`lastName`, s.`lastName`),
  spa.`fullName` = COALESCE(
    spa.`fullName`,
    TRIM(CONCAT_WS(' ', s.`firstName`, s.`middleName`, s.`lastName`))
  ),
  spa.`form` = COALESCE(spa.`form`, s.`form`),
  spa.`stream` = COALESCE(spa.`stream`, s.`stream`),
  spa.`email` = COALESCE(spa.`email`, s.`email`),
  spa.`parentPhone` = COALESCE(spa.`parentPhone`, s.`parentPhone`);

CREATE TABLE `student_password_reset_requests` (
  `id` VARCHAR(191) NOT NULL,
  `admissionNumber` VARCHAR(50) NOT NULL,
  `fullName` VARCHAR(255) NULL,
  `email` VARCHAR(100) NULL,
  `parentPhone` VARCHAR(20) NULL,
  `message` TEXT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `adminNote` TEXT NULL,
  `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `resolvedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `student_password_reset_requests_admissionNumber_idx` (`admissionNumber`),
  INDEX `student_password_reset_requests_status_idx` (`status`),
  INDEX `student_password_reset_requests_requestedAt_idx` (`requestedAt`)
);
