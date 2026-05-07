-- Add departments as a first-class School Hub type.
ALTER TABLE `school_hub_items`
  MODIFY `type` ENUM('CLUB', 'SOCIETY', 'FARM', 'BOARDING', 'SECURITY', 'DEPARTMENT') NOT NULL;

-- Multiple image support for School Hub items.
CREATE TABLE `school_hub_images` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `schoolHubItemId` INTEGER NOT NULL,
  `url` TEXT NOT NULL,
  `publicId` TEXT NULL,
  `caption` VARCHAR(255) NULL,
  `altText` VARCHAR(255) NULL,
  `displayOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `school_hub_images_schoolHubItemId_idx`(`schoolHubItemId`),
  INDEX `school_hub_images_displayOrder_idx`(`displayOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `school_hub_images`
  ADD CONSTRAINT `school_hub_images_schoolHubItemId_fkey`
  FOREIGN KEY (`schoolHubItemId`) REFERENCES `school_hub_items`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Multiple image support for public department groups.
CREATE TABLE `staff_department_images` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `staffDepartmentId` INTEGER NOT NULL,
  `url` TEXT NOT NULL,
  `publicId` TEXT NULL,
  `caption` VARCHAR(255) NULL,
  `altText` VARCHAR(255) NULL,
  `displayOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `staff_department_images_staffDepartmentId_idx`(`staffDepartmentId`),
  INDEX `staff_department_images_displayOrder_idx`(`displayOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `staff_department_images`
  ADD CONSTRAINT `staff_department_images_staffDepartmentId_fkey`
  FOREIGN KEY (`staffDepartmentId`) REFERENCES `staff_departments`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
