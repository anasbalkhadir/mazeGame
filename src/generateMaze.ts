import { Amazer, AmazerBuilder, RandomizedPrim } from "amazer"
const WIDTH = 20;
const HEIGHT = 20;
interface mazeProps {
  height?: number,
  width?: number,
};

export default function generateMaze(props: mazeProps) {
  const width = props?.width || WIDTH;
  const height = props?.height || HEIGHT;
  const config = new AmazerBuilder()
    .withSize({ width, height })
    .using(RandomizedPrim)
    .build()

  return new Amazer(config).generate()
}
