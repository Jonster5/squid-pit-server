import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { readFile, readdir } from 'fs/promises';

dotenv.config();

const PORT = process.env.PORT ?? 2000;
const app: Express = express();

const data = path.resolve(__dirname, '../', 'data');
const pd = path.resolve(__dirname, '../');

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req: Request, res: Response) => {
	const file = await readFile(path.resolve(pd, 'index.html'));

	res.status(200);
	res.send(file);
});

app.get('/assets/:asset', async (req, res) => {
	const { asset } = req.params;

	try {
		const fileNames = await readdir(path.resolve(data, asset));

		const assets = fileNames.map(async (f) =>
			JSON.parse(await readFile(path.resolve('data', asset, f), { encoding: 'utf8' }))
		);

		res.status(200);
		res.send(JSON.stringify(await Promise.all(assets)));
	} catch (err) {
		res.status(404);
		res.send('assets not found');
	}
});

app.listen(PORT, () => {
	process.stdout.write(`Running on port ${PORT}`);
});
