CREATE TABLE `request` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `customerId` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `driverId` int(11) DEFAULT NULL,
  `createdAt` int(11) DEFAULT NULL,
  `selectedAt` int(11) DEFAULT NULL,
  `completedAt` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;