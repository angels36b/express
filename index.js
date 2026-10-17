import express from 'express';
import bodyParser from 'body-parser';
import { createReadStream } from 'fs';
import crypto from 'crypto';
import http from 'http';
import cors from 'cors'; // <-- Importamos cors
import appSrc from './app.js';

// Le pasamos 'cors' como sexto argumento a la función
const app = appSrc(express, bodyParser, createReadStream, crypto, http, cors);

// Escuchamos en 0.0.0.0 para asegurar que Replit reciba tráfico externo
app.listen(process.env.PORT, '0.0.0.0'); 