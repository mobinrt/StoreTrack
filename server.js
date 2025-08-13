require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('./src/config/db');
const itemsRoutes = require('./src/routes/items');
const ordersRoutes = require('./src/routes/orders');
const stockHistoryRoutes = require('./src/routes/stockHistory');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

connectDB();

// health
app.get('/ping', (req, res) => res.json({ ok: true, time: Date.now() }));

app.use('/api/items', itemsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/stock-history', stockHistoryRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`StoreTrack backend listening on ${PORT}`));
