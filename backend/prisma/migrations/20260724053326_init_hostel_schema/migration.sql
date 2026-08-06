-- CreateTable
CREATE TABLE `hostels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `address` TEXT NULL,
    `type` ENUM('boys', 'girls', 'co_ed') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_blocks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hostel_id` INTEGER NOT NULL,
    `block_name` VARCHAR(50) NOT NULL,
    `total_floors` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hostel_capacities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `block_id` INTEGER NOT NULL,
    `total_rooms` INTEGER NOT NULL,
    `capacity_per_room` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hostel_blocks` ADD CONSTRAINT `hostel_blocks_hostel_id_fkey` FOREIGN KEY (`hostel_id`) REFERENCES `hostels`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hostel_capacities` ADD CONSTRAINT `hostel_capacities_block_id_fkey` FOREIGN KEY (`block_id`) REFERENCES `hostel_blocks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
