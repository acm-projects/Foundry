import { TextAnimate } from "./text-animate"
export default function TextAnimateDemo6() {
  return (
    <div className = "text-4xl font-bold whitespace-nowrap overflow-x-auto">
    <TextAnimate animation="slideLeft" by="character">
      Drag. Drop. Deploy.
    </TextAnimate>
    </div>
  )
}