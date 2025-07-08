-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: taskify
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `admid` int(11) NOT NULL AUTO_INCREMENT,
  `admemail` varchar(30) NOT NULL,
  `admsenha` varchar(30) NOT NULL,
  `admnome` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`admid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'admin1@taskify.com','senha123','Admin');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `amizades`
--

DROP TABLE IF EXISTS `amizades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `amizades` (
  `amiid` int(11) NOT NULL AUTO_INCREMENT,
  `amipendente` tinyint(4) NOT NULL DEFAULT 1,
  `amienvia` int(11) DEFAULT NULL,
  `amirecebe` int(11) DEFAULT NULL,
  PRIMARY KEY (`amiid`),
  KEY `amienvia` (`amienvia`),
  KEY `amirecebe` (`amirecebe`),
  CONSTRAINT `amizades_ibfk_1` FOREIGN KEY (`amienvia`) REFERENCES `usuarios` (`usuid`),
  CONSTRAINT `amizades_ibfk_2` FOREIGN KEY (`amirecebe`) REFERENCES `usuarios` (`usuid`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `amizades`
--

LOCK TABLES `amizades` WRITE;
/*!40000 ALTER TABLE `amizades` DISABLE KEYS */;
INSERT INTO `amizades` VALUES (6,0,8,13),(9,1,13,12),(11,0,14,13),(13,0,13,16),(14,1,13,15);
/*!40000 ALTER TABLE `amizades` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 trigger notamizade
after insert on amizades
for each row
insert into notificacoes(notrecebe, notenvia, nottipo)
values
(new.amirecebe, new.amienvia, 0) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comentarios` (
  `comid` int(11) NOT NULL AUTO_INCREMENT,
  `comusu` int(11) NOT NULL,
  `comtarefa` int(11) NOT NULL,
  `comtexto` text NOT NULL,
  PRIMARY KEY (`comid`),
  KEY `comusu` (`comusu`),
  KEY `comtarefa` (`comtarefa`),
  CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`comusu`) REFERENCES `usuarios` (`usuid`),
  CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`comtarefa`) REFERENCES `tarefas` (`tarid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarios`
--

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favoritos` (
  `usuid` int(11) NOT NULL,
  `quaid` int(11) NOT NULL,
  PRIMARY KEY (`usuid`,`quaid`),
  KEY `quaid` (`quaid`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`usuid`) REFERENCES `usuarios` (`usuid`),
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`quaid`) REFERENCES `quadros` (`quaid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (13,26);
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `notamizades`
--

DROP TABLE IF EXISTS `notamizades`;
/*!50001 DROP VIEW IF EXISTS `notamizades`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `notamizades` AS SELECT
 1 AS `notid`,
  1 AS `idrecebe`,
  1 AS `nomerecebe`,
  1 AS `idenvia`,
  1 AS `nomeenvia`,
  1 AS `nottipo` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `notificacoes`
--

DROP TABLE IF EXISTS `notificacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notificacoes` (
  `notid` int(11) NOT NULL AUTO_INCREMENT,
  `notrecebe` int(11) DEFAULT NULL,
  `notenvia` int(11) DEFAULT NULL,
  `nottipo` int(11) DEFAULT NULL,
  `id_quadro_envia` int(11) DEFAULT NULL,
  PRIMARY KEY (`notid`),
  KEY `notenvia` (`notenvia`),
  KEY `notrecebe` (`notrecebe`),
  KEY `fk_quadro_envia` (`id_quadro_envia`),
  CONSTRAINT `fk_quadro_envia` FOREIGN KEY (`id_quadro_envia`) REFERENCES `quadros` (`quaid`),
  CONSTRAINT `notificacoes_ibfk_1` FOREIGN KEY (`notenvia`) REFERENCES `usuarios` (`usuid`),
  CONSTRAINT `notificacoes_ibfk_2` FOREIGN KEY (`notrecebe`) REFERENCES `usuarios` (`usuid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacoes`
--

LOCK TABLES `notificacoes` WRITE;
/*!40000 ALTER TABLE `notificacoes` DISABLE KEYS */;
INSERT INTO `notificacoes` VALUES (1,12,13,0,NULL),(3,13,14,0,NULL),(5,16,13,0,NULL),(6,15,13,0,NULL);
/*!40000 ALTER TABLE `notificacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `notquadros`
--

DROP TABLE IF EXISTS `notquadros`;
/*!50001 DROP VIEW IF EXISTS `notquadros`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `notquadros` AS SELECT
 1 AS `notid`,
  1 AS `idrecebe`,
  1 AS `nomerecebe`,
  1 AS `quadroid`,
  1 AS `quadronome`,
  1 AS `nottipo` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `quadros`
--

DROP TABLE IF EXISTS `quadros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quadros` (
  `quaid` int(11) NOT NULL AUTO_INCREMENT,
  `quanome` varchar(30) NOT NULL,
  `quadesc` varchar(50) NOT NULL,
  PRIMARY KEY (`quaid`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quadros`
--

LOCK TABLES `quadros` WRITE;
/*!40000 ALTER TABLE `quadros` DISABLE KEYS */;
INSERT INTO `quadros` VALUES (18,'ServerSide','Fazer o site'),(19,'BancoDeDados','Banco'),(20,'Tarefas de casa','tarefas que preciso fazer em casa'),(23,'quadro1','desc1'),(24,'sadfsdf','dsfsdf'),(25,'quadro1','desc1'),(26,'Quadro1','desc do quadro'),(27,'quadroniki','123123'),(28,'123','123123'),(29,'123123123','123123123123'),(30,'123123123','123123123123'),(31,'123123123','13213123123'),(32,'123123123123','123123123123123'),(33,'12312312312','3123123123123123'),(34,'asdasd','asdasd'),(35,'quadro01','12312312');
/*!40000 ALTER TABLE `quadros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quadros_usuarios`
--

DROP TABLE IF EXISTS `quadros_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quadros_usuarios` (
  `quaid` int(11) NOT NULL,
  `usuid` int(11) NOT NULL,
  PRIMARY KEY (`quaid`,`usuid`),
  KEY `usuid` (`usuid`),
  CONSTRAINT `quadros_usuarios_ibfk_1` FOREIGN KEY (`quaid`) REFERENCES `quadros` (`quaid`),
  CONSTRAINT `quadros_usuarios_ibfk_2` FOREIGN KEY (`usuid`) REFERENCES `usuarios` (`usuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quadros_usuarios`
--

LOCK TABLES `quadros_usuarios` WRITE;
/*!40000 ALTER TABLE `quadros_usuarios` DISABLE KEYS */;
INSERT INTO `quadros_usuarios` VALUES (18,8),(19,8),(26,8),(26,13),(26,14),(26,16),(27,14),(28,14),(29,14),(30,14),(31,14),(32,14),(33,14),(34,8),(34,13),(34,14),(34,16),(35,8),(35,13);
/*!40000 ALTER TABLE `quadros_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tarefas`
--

DROP TABLE IF EXISTS `tarefas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tarefas` (
  `tarid` int(11) NOT NULL AUTO_INCREMENT,
  `tarnome` varchar(15) NOT NULL,
  `tardesc` varchar(50) DEFAULT NULL,
  `tarstatus` tinyint(4) NOT NULL,
  `tarusu` int(11) NOT NULL,
  `tarqua` int(11) NOT NULL,
  PRIMARY KEY (`tarid`),
  KEY `tarusu` (`tarusu`),
  KEY `tarqua` (`tarqua`),
  CONSTRAINT `tarefas_ibfk_1` FOREIGN KEY (`tarusu`) REFERENCES `usuarios` (`usuid`),
  CONSTRAINT `tarefas_ibfk_2` FOREIGN KEY (`tarqua`) REFERENCES `quadros` (`quaid`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarefas`
--

LOCK TABLES `tarefas` WRITE;
/*!40000 ALTER TABLE `tarefas` DISABLE KEYS */;
INSERT INTO `tarefas` VALUES (20,'Criar o Dashboa','Do admin',1,8,18),(21,'Dashboard usuar','Usuario',1,8,18),(22,'Banco','Banco',1,8,19),(27,'tarefita1','asdasdasd',1,13,26),(28,'asdasd','asdasdasd',1,14,27),(29,'asdasdasdasdasd','',0,14,27),(30,'asdasdasd','asdasdas',0,14,34);
/*!40000 ALTER TABLE `tarefas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `usuid` int(11) NOT NULL AUTO_INCREMENT,
  `usunome` varchar(30) NOT NULL,
  `usuemail` varchar(30) NOT NULL,
  `usunascimento` date NOT NULL,
  `ususenha` varchar(30) NOT NULL,
  `usubio` char(40) DEFAULT NULL,
  PRIMARY KEY (`usuid`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (8,'Conta Teste Entrega','testeEntrega@gmail.com','2001-01-01','123',NULL),(12,'Joselito','joselito@gmail.com','2004-03-20','abcd123',NULL),(13,'Rubem Krüger','rubem@gmail.com','2004-09-22','123',NULL),(14,'nicolas','nicolas@gmail.com','1111-11-11','123',NULL),(15,'Rubem Kr?ger','rubem@example.com','2000-01-01','senha123','Estudante de Engenharia de Software'),(16,'chiloids','chiloia@gmail.com','2222-02-22','123',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `notamizades`
--

/*!50001 DROP VIEW IF EXISTS `notamizades`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `notamizades` AS select `n`.`notid` AS `notid`,`n`.`notrecebe` AS `idrecebe`,`u1`.`usunome` AS `nomerecebe`,`n`.`notenvia` AS `idenvia`,`u2`.`usunome` AS `nomeenvia`,`n`.`nottipo` AS `nottipo` from ((`notificacoes` `n` join `usuarios` `u1` on(`u1`.`usuid` = `n`.`notrecebe`)) join `usuarios` `u2` on(`u2`.`usuid` = `n`.`notenvia`)) where `n`.`nottipo` = 0 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `notquadros`
--

/*!50001 DROP VIEW IF EXISTS `notquadros`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `notquadros` AS select `n`.`notid` AS `notid`,`n`.`notrecebe` AS `idrecebe`,`u`.`usunome` AS `nomerecebe`,`q`.`quaid` AS `quadroid`,`q`.`quanome` AS `quadronome`,`n`.`nottipo` AS `nottipo` from ((`notificacoes` `n` join `usuarios` `u` on(`u`.`usuid` = `n`.`notrecebe`)) join `quadros` `q` on(`q`.`quaid` = `n`.`id_quadro_envia`)) where `n`.`nottipo` = 2 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-07 22:37:04
