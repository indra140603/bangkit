import { readFile } from 'fs/promises';
import * as tf from '@tensorflow/tfjs-node';

let model;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      if (!model) {
        const modelData = JSON.parse(
          await readFile('./model/tukang_rate_predictor_model.json', 'utf-8')
        );
        model = tf.models.modelFromJSON(modelData);
      }

      const { input } = req.body;
      if (!Array.isArray(input) || input.length !== 3) {
        return res.status(400).json({ error: 'Invalid input. Expecting an array of 3 values.' });
      }

      const tensorInput = tf.tensor2d([input]);
      const prediction = model.predict(tensorInput);
      const result = (await prediction.array())[0][0];
      prediction.dispose();

      return res.status(200).json({ result });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
