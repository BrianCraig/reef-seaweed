import { useEffect, useState } from "react"
import { Button, Heading, Stack } from "@chakra-ui/react"
import "./homepage.css"
import { useHistory } from "react-router"

const EffectComponent = () => {

  const { push } = useHistory();
  const [state, setState] = useState<any>({
    offsetX: 0,
    offsetY: 0,
    friction: 1 / 64
  })
  const mouseMove = (e: any) => {
    let followX = (window.innerWidth / 2 - e.clientX);
    let followY = (window.innerHeight / 2 - e.clientY);

    let x = 0,
      y = 0;
    x += ((-followX - x) * state.friction);
    y += (followY - y) * state.friction;
    setState((state: any) => ({
      ...state,
      offsetX: x,
      offsetY: y
    }));
  }
  useEffect(() => {
    document.addEventListener('mousemove', mouseMove);
    return () => document.removeEventListener('mousemove', mouseMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let offset = {
    transform: ` perspective(600px) rotateY(${state.offsetX}deg) rotateX(${state.offsetY}deg)`
  }

  return <div className='wrapper' style={offset}>
    <Heading size={"4xl"} textAlign={"center"}>Your next most loved project</Heading>
    <div className="shape">
      <Heading size={"4xl"} textAlign={"center"}>A few touchs away</Heading>
    </div>
    <Stack className="shape2" spacing={16} justifyContent={"center"} direction={"row"}>
      <Button size={"lg"} onClick={() => push("/projects")}>See projects</Button>
      <Button size={"lg"} onClick={() => push("/docs")}>Learn more</Button>
    </Stack>
  </div>

}

export const HomePage = () => {
  return <Stack spacing={8} justifyContent={"space-around"} height={"calc(100vh - 128px)"} overflow={"visible"}>
    < EffectComponent />
  </Stack >
}