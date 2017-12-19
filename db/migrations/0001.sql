CREATE TABLE `request` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `customer` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `driver` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `selectedAt` datetime DEFAULT NULL,
  `completedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;