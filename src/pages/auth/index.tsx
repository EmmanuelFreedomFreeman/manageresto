import { useSession, signIn, signOut } from "next-auth/react"
import HomeScreen from "../home/HomeScreen"

export default function Component() {
  const { data: session } = useSession()
 
  return (
    <>
    {session ? (
      <div>
        <div className="shadow-lg m-3">
          <div className="flex justify-between">
            <img className="w-10 h-10 rounded-full p-1" src={session?.user?.image? session?.user?.image : ''} alt={session.user?.name? session.user?.name : '' }  />
              
            <button onClick={() => signOut()}>Sign out</button>
          </div>
        </div>
        <HomeScreen />
      </div>
    ):(
      <div className="shadow-lg m-3">
      <div className="flex justify-between">
        <img className="w-10 h-10 rounded-full p-1" src='' alt='sess'  />
          
        <button onClick={() => signIn()}>Sign In</button>
      </div>
  </div>
    )}
      
    </>
  )
}