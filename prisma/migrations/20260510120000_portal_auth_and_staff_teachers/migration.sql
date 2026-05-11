-- Student portal credentials are intentionally separated from uploaded student rows so re-uploads do not remove passwords.
CREATE TABLE `student_portal_accounts` (
  `id` VARCHAR(191) NOT NULL,
  `admissionNumber` VARCHAR(50) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `passwordSetAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `lastLoginAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `student_portal_accounts_admissionNumber_key`(`admissionNumber`),
  INDEX `student_portal_accounts_admissionNumber_idx`(`admissionNumber`)
);

-- Teacher records use the existing Staff table but can now be linked to valid public departments.
ALTER TABLE `Staff`
  ADD COLUMN `staffType` VARCHAR(50) NULL DEFAULT 'Leadership',
  ADD COLUMN `departmentId` INTEGER NULL,
  ADD COLUMN `subjectOffered` VARCHAR(255) NULL;

CREATE INDEX `Staff_departmentId_idx` ON `Staff`(`departmentId`);

ALTER TABLE `Staff`
  ADD CONSTRAINT `Staff_departmentId_fkey`
  FOREIGN KEY (`departmentId`) REFERENCES `staff_departments`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- The departments API already accepts this value; persist it safely.
ALTER TABLE `staff_departments`
  ADD COLUMN `assistantHeadName` VARCHAR(255) NULL;
