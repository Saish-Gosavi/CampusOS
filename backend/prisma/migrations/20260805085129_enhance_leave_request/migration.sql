-- AlterTable
ALTER TABLE `leaverequest` ADD COLUMN `contactPhone` VARCHAR(191) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `destination` VARCHAR(191) NULL,
    ADD COLUMN `leaveType` VARCHAR(191) NOT NULL DEFAULT 'Personal',
    ADD COLUMN `parentContact` VARCHAR(191) NULL,
    ADD COLUMN `remarks` TEXT NULL,
    ADD COLUMN `reviewedAt` DATETIME(3) NULL,
    ADD COLUMN `reviewedBy` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `reason` TEXT NOT NULL;

-- CreateIndex
CREATE INDEX `LeaveRequest_status_idx` ON `LeaveRequest`(`status`);

-- CreateIndex
CREATE INDEX `LeaveRequest_startDate_idx` ON `LeaveRequest`(`startDate`);
