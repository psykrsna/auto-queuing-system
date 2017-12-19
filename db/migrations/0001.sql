CREATE TABLE `request` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `customerId` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `driverId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `selectedAt` datetime DEFAULT NULL,
  `completedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;