import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"


 
export const Buttons=({name='Login',className=''})=> {
  return (
             <Button className={`bg-accent-foreground mt-4 w-[15vw] ${className}`}>{name}</Button>
    
  )
}