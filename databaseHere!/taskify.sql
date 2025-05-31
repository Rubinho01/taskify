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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
-- Table structure for table `grupos`
--

DROP TABLE IF EXISTS `grupos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grupos` (
  `grupoid` int(11) NOT NULL AUTO_INCREMENT,
  `grunome` varchar(100) NOT NULL,
  `grudesc` text DEFAULT NULL,
  `criado_em` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`grupoid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupos`
--

LOCK TABLES `grupos` WRITE;
/*!40000 ALTER TABLE `grupos` DISABLE KEYS */;
/*!40000 ALTER TABLE `grupos` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quadros`
--

LOCK TABLES `quadros` WRITE;
/*!40000 ALTER TABLE `quadros` DISABLE KEYS */;
INSERT INTO `quadros` VALUES (18,'ServerSide','Fazer o site'),(19,'BancoDeDados','Banco'),(20,'Tarefas de casa','tarefas que preciso fazer em casa');
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
INSERT INTO `quadros_usuarios` VALUES (18,8),(19,8),(20,9);
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarefas`
--

LOCK TABLES `tarefas` WRITE;
/*!40000 ALTER TABLE `tarefas` DISABLE KEYS */;
INSERT INTO `tarefas` VALUES (20,'Criar o Dashboa','Do admin',1,8,18),(21,'Dashboard usuar','Usuario',1,8,18),(22,'Banco','Banco',1,8,19),(23,'Limpar o chão','limpar o chao ate 12:00',1,9,20);
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
  `grupoid` int(11) DEFAULT NULL,
  PRIMARY KEY (`usuid`),
  KEY `fk_usuarios_grupos` (`grupoid`),
  CONSTRAINT `fk_usuarios_grupos` FOREIGN KEY (`grupoid`) REFERENCES `grupos` (`grupoid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (8,'Conta Teste Entrega','testeEntrega@gmail.com','2001-01-01','123',NULL),(9,'Rubinho','rubem@gmail.com','2004-09-22','rubemg007',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_grupos`
--

DROP TABLE IF EXISTS `usuarios_grupos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios_grupos` (
  `usuid` int(11) NOT NULL,
  `grupoid` int(11) NOT NULL,
  PRIMARY KEY (`usuid`,`grupoid`),
  KEY `grupoid` (`grupoid`),
  CONSTRAINT `usuarios_grupos_ibfk_1` FOREIGN KEY (`usuid`) REFERENCES `usuarios` (`usuid`),
  CONSTRAINT `usuarios_grupos_ibfk_2` FOREIGN KEY (`grupoid`) REFERENCES `grupos` (`grupoid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_grupos`
--

LOCK TABLES `usuarios_grupos` WRITE;
/*!40000 ALTER TABLE `usuarios_grupos` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios_grupos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-31 18:53:49
