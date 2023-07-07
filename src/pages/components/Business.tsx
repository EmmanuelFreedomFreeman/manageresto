import React, { useEffect, useState } from 'react'
import { doc, setDoc,onSnapshot  } from "firebase/firestore"; 
import { useSession} from "next-auth/react"
import { db} from '../../../firebase'
import { useRouter } from 'next/router'
function Business() {

  const router = useRouter()
  
  const datatype = {
    type : '',
    name : '',
    contact : ''
  }
  const { data: session } = useSession()
  const [type, setType] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [shopdata, setShopdata] = useState(datatype)

  const InsertBusiness = async() => {

    if (session?.user?.email) {
      await setDoc(doc(db, session?.user?.email, "SHOP"), {
        type: type,
        name: name,
        contact: contact
      }).then(()=>{
        setContact('')
        setName('')
        setType('')
        alert('data has been submited')
      }).catch((error) => {
        alert(`Unsuccessful returned error ${error}`)});
      
    }
    

  }

  useEffect(() => {
    //console.log(router.query)
  }, [])
  



  useEffect(() => {
    if (session?.user?.email) {
      const unsub = onSnapshot(doc(db, session?.user?.email, "SHOP"), (doc:any) => {
        setShopdata(doc.data())
      });
      //unsub()
    }
    
  }, [shopdata])
  
  return (
    <div>
      
      <p className='font-bold underline text-2xl text-center'>BUSINESS</p>
      <div className='flex justify-between mr-3'>  
        <div>

          <div className='flex justify-start pl-10 mt-4'>
            <p className='mr-3 pt-2'>TYPE : </p>
            <input type='text' value={type} onChange={(e)=>setType(e.target.value)} className='ml-8 bg-gray-600 rounded-lg text-white h-10 focus:border-b-black ' />
          </div>

          <div className='flex justify-start pl-10 mt-4'>
            <p className='mr-3 pt-2'>NAME : </p>
            <input type='text' value={name} onChange={(e)=>setName(e.target.value)} className='ml-6 bg-gray-600 rounded-lg text-white h-10 focus:border-b-black ' />
          </div>

          <div className='flex justify-start pl-10 mt-4'>
            <p className='mr-3 pt-2'>CONTACT : </p>
            <input type='text' value={contact} onChange={(e)=>setContact(e.target.value)} className='bg-gray-600 rounded-lg text-white h-10 focus:border-b-black ' />
          </div>

          <button onClick={InsertBusiness} className="ml-9 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
            Submit
          </button>

        </div>
        {/* start table */}

        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table
                    className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
                    <thead className="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th
                          scope="col"
                          className="border-r px-6 py-4 dark:border-neutral-500">
                          #
                        </th>
                        <th
                          scope="col"
                          className="border-r px-6 py-4 dark:border-neutral-500">
                          TYPE
                        </th>
                        <th
                          scope="col"
                          className="border-r px-6 py-4 dark:border-neutral-500">
                          NAME
                        </th>
                        <th scope="col" className="px-6 py-4">CONTACT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b dark:border-neutral-500">
                        <td
                          className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                          1
                        </td>
                        <td
                          className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                          {shopdata?.type}
                        </td>
                        <td
                          className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                          {shopdata?.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {shopdata?.contact}
                        </td>
                      </tr>
                      
                      
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        {/* end table */}
      </div>
    </div>
  )
}

export default Business