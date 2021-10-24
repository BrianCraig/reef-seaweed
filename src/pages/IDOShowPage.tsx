import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";

export const IDOShowPage: FunctionComponent = () => {
  let { tx } = useParams<{ tx: string }>();
  return <p>{tx}</p>
}