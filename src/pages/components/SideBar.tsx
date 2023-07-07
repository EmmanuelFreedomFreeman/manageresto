import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useSession} from "next-auth/react"
import { doc, onSnapshot,setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
interface TypeMEnu {
    menu : string
    setMenu : Dispatch<SetStateAction<string>>
}
function SideBar(props : TypeMEnu) {
    const { data: session } = useSession()
    const [order, setOrder] = useState<any[]>([])
    const [note, setNote] = useState(0)
    const ListMenu = ['BUSINESS','CATEGORIES','ARTICLES','NEW ORDERS','ALL ORDERS']
    const company = String(session?.user?.email)
    useEffect(() => {
        const unsubcat = onSnapshot(doc(db,company, "ORDER"), (doc) => {
            doc.data()?.order? setOrder([...doc.data()?.order]):'';
          });
    }, [])
    

  return (
    <div className='p-3 shadow-sm'>
        <p className='text-center font-bold'>MENU</p>
        {ListMenu.map((val,index)=>(
            <div key={index} onClick={()=>props.setMenu(val)} className='mt-5 bg-slate-100 pt-5 pb-5 pl-1 cursor-pointer hover:font-bold hover:bg-slate-200 rounded-md'>
                <div className='flex justify-between'>
                    <p>{val}</p>
                    {val == 'NEW ORDERS' ? (<p className='text-red-400 text-lg font-bold pr-2 pl-2 mr-1 bg-red-100 text-center '>{order.filter((e) => e.etat == 'new order').length}</p>):(<p></p>)}
                </div>
            </div>
        ))}
    </div>
  )
}

export default SideBar