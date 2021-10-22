import { CornerDialog, TextInputField } from "evergreen-ui";
import React, { useContext, useEffect } from "react"
import { TxContext } from "../contexts/TxContext"

export const TxCallerComponent: React.FunctionComponent = () => {
  const { active, setActive, call, factory } = useContext(TxContext);
  const [values, setValues] = React.useState<{ [key: string]: string }>({})
  useEffect(() => {
    if (active === false) {
      setValues({})
    }
  }, [active])
  return (
    <CornerDialog
      title={factory?.type.title}
      isShown={active}
      onCloseComplete={() => setActive(false)}
      onConfirm={() => call(values)}
      confirmLabel="Call"
      cancelLabel="Cancel"
    >
      {factory?.type.fields.map(field =>
        <TextInputField
          key={field.name}
          label={field.name}
          placeholder={field.name}
          onChange={(e: any) => setValues((or) => ({ ...or, [field.name]: e.target.value }))}
          value={values[field.name] || ""}
        />
      )}
      {null}
    </CornerDialog>
  )
}