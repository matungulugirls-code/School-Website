-- Student contact enrichment for assignment/resource delivery preparation
ALTER TABLE `Assignment`
  ADD COLUMN `targetCriteria` JSON NULL,
  ADD COLUMN `senderReference` VARCHAR(20) NOT NULL DEFAULT '0793472960',
  ADD COLUMN `deliveryStatus` VARCHAR(50) NOT NULL DEFAULT 'prepared',
  ADD COLUMN `deliverySummary` JSON NULL;

ALTER TABLE `resources`
  ADD COLUMN `targetCriteria` JSON NULL,
  ADD COLUMN `senderReference` VARCHAR(20) NOT NULL DEFAULT '0793472960',
  ADD COLUMN `deliveryStatus` VARCHAR(50) NOT NULL DEFAULT 'prepared',
  ADD COLUMN `deliverySummary` JSON NULL;

ALTER TABLE `students`
  ADD COLUMN `fullName` VARCHAR(255) NULL,
  ADD COLUMN `gradeLevel` VARCHAR(50) NULL,
  ADD COLUMN `className` VARCHAR(100) NULL,
  ADD COLUMN `studentPhone` VARCHAR(20) NULL,
  ADD COLUMN `whatsappPhone` VARCHAR(20) NULL,
  ADD COLUMN `uploadedCategory` VARCHAR(100) NULL;

UPDATE `students`
SET
  `fullName` = TRIM(CONCAT(COALESCE(`firstName`, ''), ' ', COALESCE(`middleName`, ''), ' ', COALESCE(`lastName`, ''))),
  `gradeLevel` = `form`,
  `className` = TRIM(CONCAT(COALESCE(`form`, ''), ' ', COALESCE(`stream`, ''))),
  `whatsappPhone` = `parentPhone`
WHERE `fullName` IS NULL;

ALTER TABLE `student_stats`
  ADD COLUMN `grade10` INT NOT NULL DEFAULT 0,
  ADD COLUMN `grade11` INT NOT NULL DEFAULT 0,
  ADD COLUMN `grade12` INT NOT NULL DEFAULT 0;

CREATE TABLE `assignment_delivery_recipients` (
  `id` VARCHAR(191) NOT NULL,
  `assignmentId` INT NOT NULL,
  `studentId` VARCHAR(191) NULL,
  `admissionNumber` VARCHAR(50) NOT NULL,
  `studentName` VARCHAR(255) NOT NULL,
  `className` VARCHAR(100) NULL,
  `gradeLevel` VARCHAR(50) NULL,
  `uploadedCategory` VARCHAR(100) NULL,
  `whatsappPhone` VARCHAR(20) NOT NULL,
  `senderReference` VARCHAR(20) NOT NULL DEFAULT '0793472960',
  `channel` VARCHAR(30) NOT NULL DEFAULT 'whatsapp',
  `status` VARCHAR(50) NOT NULL DEFAULT 'prepared',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `assignment_delivery_recipients_assignment_admission_key`(`assignmentId`, `admissionNumber`),
  INDEX `assignment_delivery_recipients_assignmentId_idx`(`assignmentId`),
  INDEX `assignment_delivery_recipients_studentId_idx`(`studentId`),
  INDEX `assignment_delivery_recipients_whatsappPhone_idx`(`whatsappPhone`),
  INDEX `assignment_delivery_recipients_status_idx`(`status`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `resource_delivery_recipients` (
  `id` VARCHAR(191) NOT NULL,
  `resourceId` INT NOT NULL,
  `studentId` VARCHAR(191) NULL,
  `admissionNumber` VARCHAR(50) NOT NULL,
  `studentName` VARCHAR(255) NOT NULL,
  `className` VARCHAR(100) NULL,
  `gradeLevel` VARCHAR(50) NULL,
  `uploadedCategory` VARCHAR(100) NULL,
  `whatsappPhone` VARCHAR(20) NOT NULL,
  `senderReference` VARCHAR(20) NOT NULL DEFAULT '0793472960',
  `channel` VARCHAR(30) NOT NULL DEFAULT 'whatsapp',
  `status` VARCHAR(50) NOT NULL DEFAULT 'prepared',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `resource_delivery_recipients_resource_admission_key`(`resourceId`, `admissionNumber`),
  INDEX `resource_delivery_recipients_resourceId_idx`(`resourceId`),
  INDEX `resource_delivery_recipients_studentId_idx`(`studentId`),
  INDEX `resource_delivery_recipients_whatsappPhone_idx`(`whatsappPhone`),
  INDEX `resource_delivery_recipients_status_idx`(`status`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE INDEX `students_gradeLevel_idx` ON `students`(`gradeLevel`);
CREATE INDEX `students_className_idx` ON `students`(`className`);
CREATE INDEX `students_uploadedCategory_idx` ON `students`(`uploadedCategory`);
CREATE INDEX `students_whatsappPhone_idx` ON `students`(`whatsappPhone`);

ALTER TABLE `assignment_delivery_recipients`
  ADD CONSTRAINT `assignment_delivery_recipients_assignmentId_fkey`
  FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `assignment_delivery_recipients`
  ADD CONSTRAINT `assignment_delivery_recipients_studentId_fkey`
  FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `resource_delivery_recipients`
  ADD CONSTRAINT `resource_delivery_recipients_resourceId_fkey`
  FOREIGN KEY (`resourceId`) REFERENCES `resources`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `resource_delivery_recipients`
  ADD CONSTRAINT `resource_delivery_recipients_studentId_fkey`
  FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
