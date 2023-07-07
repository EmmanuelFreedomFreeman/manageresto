import React, { useEffect, useRef, useState } from 'react'
import { useSession} from "next-auth/react"
import { doc, onSnapshot,setDoc } from "firebase/firestore";
import { db } from '../../../firebase';
import SideBar from '../components/SideBar'
import Business from '../components/Business'
import Categories from '../components/Categories'
import Articles from '../components/Articles'
import {motion} from 'framer-motion'
import Orders from '../components/Orders'
import Allorders from '../components/Allorders'
function HomeScreen() {
    const { data: session } = useSession()
    const [menu, setMenu] = useState<string>('BUSINESS')
    const [order, setOrder] = useState<any[]>([])
    const company = String(session?.user?.email)

    useEffect(() => {
        const unsuborders = onSnapshot(doc(db,company, "ORDER"), (doc) => {
            let listeorders:any = []
            doc.data()?.order? listeorders = [...doc.data()?.order]:'';
            listeorders.map((value:any,index:number)=>{
                if (value?.etat == 'new order') {
                    var msg = new SpeechSynthesisUtterance();
                    msg.text = `the order of the client ${value?.name} has been made. table ${value?.url?.table}.`
                    msg.rate = 0.8;
                    window.speechSynthesis.speak(msg)
                }
            })
          });
    }, [])


    switch(menu) { 
        case 'ARTICLES': { 
            return (
                <div className='flex justify-between '>
                    <div className='bg-white w-40 mx-3'>
                        <SideBar menu={menu} setMenu={setMenu} />
                    </div>
                    <div className='bg-white mr-3 flex-1 w-96'>
                        <Articles />
                    </div>
                </div>
              )
           break; 
        } 
        case 'CATEGORIES': { 
            return (
                <div className='flex justify-between'>
                    <div className='bg-white w-40 mx-3'>
                        <SideBar menu={menu} setMenu={setMenu} />
                    </div>
                    <div  className='bg-white mr-3 flex-1'>
                        <Categories />
                    </div>
                </div>
              )
           break; 
        } 
        case 'NEW ORDERS': { 
            return (
                <div className='flex justify-between '>
                    <div className='bg-white w-40 mx-3'>
                        <SideBar menu={menu} setMenu={setMenu} />
                    </div>
                    <div className='bg-white mr-3 flex-1 w-96'>
                        <Orders />
                    </div>
                </div>
              )
           break; 
        } 
        case 'ALL ORDERS': { 
            return (
                <div className='flex justify-between '>
                    <div className='bg-white w-40 mx-3'>
                        <SideBar menu={menu} setMenu={setMenu} />
                    </div>
                    <div className='bg-white mr-3 flex-1 w-96'>
                        <Allorders />
                    </div>
                </div>
              )
           break; 
        } 
        default: { 
            return (
                <div className='flex justify-between'>
                    <div className='bg-white w-40 mx-3'>
                        <SideBar menu={menu} setMenu={setMenu} />
                    </div>
                    <motion.div
                       initial={{ opacity: 0, scale: 0.5 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{
                         duration: 0.3,
                         ease: [0, 0.71, 0.2, 1.01],
                         scale: {
                           type: "spring",
                           damping: 5,
                           stiffness: 100,
                           restDelta: 0.001
                         }
                       }}
                        className='bg-white mr-3 flex-1'>
                        <Business />
                    </motion.div>
                </div>
              )
           break; 
        } 
     } 
    
  return (
    <div className='flex justify-between'>
        <div className='bg-white w-40 mx-3'>
            <SideBar menu={menu} setMenu={setMenu} />
        </div>
        <div>
            
        </div>
    </div>
  )
}

export default HomeScreen