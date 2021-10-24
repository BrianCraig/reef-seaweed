import React, { useContext, useState } from "react";
import { Pane, Button, TextInput, majorScale } from "evergreen-ui";
import { ContractsContext } from "../contexts/ContractsContext";

export const ListEditorComponent: React.FunctionComponent<{ list: string[], setList: React.Dispatch<React.SetStateAction<string[]>> }> =
  ({ list, setList }) => {
    const [listClone, setListClone] = useState<string[]>(list);

    return <>
      {listClone.map((el, index) =>
        <Pane display={"flex"} alignItems="center" gap={majorScale(1)} key={index}>
          <TextInput width={400} onChange={(ev: any) => { listClone[index] = ev.target.value; setListClone([...listClone]) }} value={el} />
          <Button onClick={() => { listClone.splice(index, 1); setListClone([...listClone]) }} children="remove" />
        </Pane>
      )}
      <Pane display={"flex"} alignItems="center" gap={majorScale(1)}>
        <Button onClick={() => setListClone([...listClone, ""])} children="Add" />
        <Button onClick={() => setList(listClone)} children={"Apply"} />
      </Pane>
    </>
  }

export const ContractListEditorComponent = () => {
  const { contractsList, setContractsList } = useContext(ContractsContext);
  return <ListEditorComponent list={contractsList} setList={setContractsList} />
}