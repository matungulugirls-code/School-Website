ALTER TABLE `Assignment`
  ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN `isVisible` BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN `publishedAt` DATETIME(3) NULL;

CREATE TABLE `community_profiles` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `position` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `categoryType` ENUM('ALUMNI', 'BOM', 'CURRENT_PRINCIPAL', 'PAST_PRINCIPAL') NOT NULL,
  `image` TEXT NULL,
  `achievements` JSON NOT NULL,
  `yearsServed` VARCHAR(100) NULL,
  `displayOrder` INTEGER NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `isPublished` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `community_profiles_categoryType_idx`(`categoryType`),
  INDEX `community_profiles_displayOrder_idx`(`displayOrder`),
  INDEX `community_profiles_isActive_idx`(`isActive`),
  INDEX `community_profiles_isPublished_idx`(`isPublished`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `community_profile_images` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `communityProfileId` INTEGER NOT NULL,
  `url` TEXT NOT NULL,
  `publicId` TEXT NULL,
  `caption` VARCHAR(255) NULL,
  `altText` VARCHAR(255) NULL,
  `displayOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `community_profile_images_communityProfileId_idx`(`communityProfileId`),
  INDEX `community_profile_images_displayOrder_idx`(`displayOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `community_profile_images`
  ADD CONSTRAINT `community_profile_images_communityProfileId_fkey`
  FOREIGN KEY (`communityProfileId`) REFERENCES `community_profiles`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
