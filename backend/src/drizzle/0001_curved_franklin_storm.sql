ALTER TABLE `login_attemp` MODIFY COLUMN `userId` int unsigned;--> statement-breakpoint
ALTER TABLE `login_attemp` ADD `device_info` json NOT NULL;--> statement-breakpoint
ALTER TABLE `login_attemp` ADD `ip_address` varchar(45) NOT NULL;