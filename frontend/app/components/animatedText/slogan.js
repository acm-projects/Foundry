import { TextAnimate } from "./text-animate"
export default function TextAnimateDemo6() {
  return (
    <div className = "text-size-4xl font-bold">
    <TextAnimate animation="slideLeft" by="character">
      Drag.Drop.Deploy
    </TextAnimate>
    </div>
  )
}