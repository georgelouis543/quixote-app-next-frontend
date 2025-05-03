import Image from "next/image";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="w-[40%] border-2 border-black mt-20">

      <CardHeader className="flex flex-col items-center">

        <Image
            src="/images/quixote-logo.svg"
            alt="App Logo"
            width={500}
            height={500}
            className="mb-10"
        />

        <CardTitle className="text-xl text-center border-b-2 border-black p-1">
          Continue with your meltwater account
        </CardTitle>

      </CardHeader>

      <CardContent className="flex justify-center items-center w-full p-3">

        <div className="border border-black px-3 py-2">
          Add Google Button here
        </div>

      </CardContent>

    </Card>
  )
}