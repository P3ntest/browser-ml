import * as tf from "@tensorflow/tfjs";
import { useState } from "react";
import { useEffect } from "react";
import Plot from "react-plotly.js";
import { InputFunction } from "./components/InputFunction";
import { Slider } from "./components/Slider";

let model;

function App() {
  const [inputDataset, setInputDataset] = useState({});
  const [outputDataset, setOutputDataset] = useState({});

  const [inputFunction, setInputFunction] = useState(() => (x) => x);

  const [batchSize, setBatchSize] = useState(500);

  useEffect(() => {});

  useEffect(() => {
    if (model) {
      model.stopTraining = true;
    }
    model = tf.sequential();
    (async () => {
      model.add(
        tf.layers.dense({
          inputShape: [1],
          activation: "sigmoid",
          units: 50,
        })
      );

      model.add(
        tf.layers.dense({
          activation: "sigmoid",
          units: 50,
        })
      );

      model.add(
        tf.layers.dense({
          units: 1,
        })
      );

      model.compile({
        optimizer: tf.train.sgd(0.01),
        loss: "meanSquaredError",
      });

      const MIN = 0;
      const MAX = 10;
      const STEP = 0.001;

      const xs = [];
      const ys = [];

      for (let i = MIN; i < MAX; i += STEP) {
        xs.push([i]);
        ys.push([inputFunction(i)]);
      }

      setInputDataset({
        x: xs.map((el) => el[0]),
        y: ys.map((el) => el[0]),
      });

      const OUTPUT_DISPLAY_AMOUNT = 10;

      const OUTPUT_DISPLAY_DENSITY = (MAX - MIN) / OUTPUT_DISPLAY_AMOUNT;

      const setCurrentTrained = () => {
        setOutputDataset({
          x: Array(OUTPUT_DISPLAY_AMOUNT + 1)
            .fill()
            .map((e, i) => OUTPUT_DISPLAY_DENSITY * i),
          y: Array(OUTPUT_DISPLAY_AMOUNT + 1)
            .fill()
            .map(
              (e, i) =>
                model
                  .predict([tf.tensor1d([OUTPUT_DISPLAY_DENSITY * i])])
                  .dataSync()[0]
            ),
        });
      };

      await model.fitDataset(
        tf.data
          .zip({
            xs: tf.data.array(xs),
            ys: tf.data.array(ys.map((el) => el[0])),
          })
          .batch(500)
          .shuffle(1000),
        {
          epochs: 100,
          callbacks: {
            onEpochEnd: (epochs, logs) => {
              console.log(epochs);
              if (epochs > 0) setCurrentTrained();
            },
          },
        }
      );
    })();
  }, [inputFunction, batchSize]);

  return (
    <div>
      <Plot
        data={[
          { ...inputDataset, type: "scatter", mode: "lines", name: "Input" },
          { ...outputDataset, type: "scatter", mode: "lines", name: "Output" },
        ]}
        layout={{
          title: "Learning Preview",
        }}
      />
      <InputFunction
        inputFunction={inputFunction}
        setInputFunction={setInputFunction}
      />
      <button onClick={() => (model.stopTraining = true)}>Stop</button>
      <Slider max={1000} value={batchSize} onChange={setBatchSize}>
        BatchSize
      </Slider>
    </div>
  );
}

export default App;
