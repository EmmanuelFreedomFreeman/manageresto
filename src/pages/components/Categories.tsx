import { addDoc, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { db } from '../../../firebase'

function Categories() {
  
  const { data: session } = useSession()
  const [buttonupdate, setButtonupdate] = useState(false)
  const [category, setCategory] = useState('')
  const [typecat, setTypecat] = useState('')
  const [getindex, setGetindex] = useState(Number)
  const [categories, setCategories] = useState<any[]>([]);
  const [getallcategories, setGetallCategories] = useState<any[]>([]);
  const [shopdata, setShopdata] = useState(false)
  const GetShop = async () => {
    if (session?.user?.email) {
      const docRef = doc(db, session?.user?.email, "SHOP");
      const docSnap =  await getDoc(docRef);

      if (docSnap.exists()) {
        setShopdata(true);
      } else {
        // docSnap.data() will be undefined in this case
        
      }
    }
  }

  const GetInitialCategories = () => {
    if (session?.user?.email) {
      const unsub = onSnapshot(doc(db, session?.user?.email, "CATEGORIES"), (doc:any) => {
        setGetallCategories([...doc.data().category])
      });
      return unsub()
    }
  }

  const AddCategories = async () => {
    if (session?.user?.email) {

      // INSERT CATEGORY
     
      await setDoc(doc(db, session?.user?.email, "CATEGORIES"), {
        category: categories,
      }).then(()=>{
        setCategory('')
        setTypecat('')
        setCategories([])
        alert('data has been submited')
      }).catch((error) => {
        alert(`Unsuccessful returned error ${error}`)});
      
    }
  }

    // update categories
    const UpdateCategories = async () => {
      
      const arr = [...getallcategories]
      arr[getindex] = {category:category,type:typecat}
      if (session?.user?.email) {
        // UPDATE CATEGORY
        await setDoc(doc(db, session?.user?.email, "CATEGORIES"), {
          category: arr,
        }).then(()=>{
          setCategory('')
          setTypecat('')
          setCategories([])
          setGetindex(Number)
          alert('data has been updated')
          setButtonupdate(false)
        }).catch((error) => {
          alert(`Unsuccessful returned error ${error}`)});
        
      }


    }

    const DeleteCategory = async () => {
      const arr = [...getallcategories]
      
      arr.splice(getindex,1)
      if (session?.user?.email) {
        // UPDATE CATEGORY
        await setDoc(doc(db, session?.user?.email, "CATEGORIES"), {
          category: arr,
        }).then(()=>{
          setCategory('')
          setTypecat('')
          setCategories([])
          setGetindex(Number)
          alert('data has been deleted')
        }).catch((error) => {
          alert(`Unsuccessful returned error ${error}`)});
        
      }

    }


  useEffect(() => {
    GetShop()

  }, [])

  useEffect(() => {
    
    return () => {
      GetInitialCategories()
      
    }
  }, [getallcategories])
  

  useEffect(() => {
    
    const GetAllCategories = async () => {
      if (session?.user?.email) {
        const unsub = onSnapshot(doc(db, session?.user?.email, "CATEGORIES"), (doc:any) => {
          doc.data()?.category? setCategories([...doc.data().category,{category:category,type:typecat}]):null
          doc.data()?.category? setGetallCategories([...doc.data().category]):null
        });
        //unsub()
      }
    }

    
  
    GetAllCategories()
  }, [category,typecat])
  
  

  return (
    <div>
        <p className='font-bold underline text-2xl text-center'>CATEGORIES</p>
        <div className='flex justify-between mr-3'>
          <div>

            <div className='flex justify-start pl-10 mt-4'>
              <p className='mr-3 pt-2'>CATEGORY NAME : </p>
              <input type='text' value={category} onChange={(e)=>{
                setCategory(e.target.value)
              
              }} className='ml-11 bg-gray-600 rounded-lg text-white h-10 focus:border-b-black w-52' />
            </div>
            <div className='flex justify-start pl-10 mt-4'>
            <p className='mr-3 pt-2'>TYPE OF THE CATEGORY : </p>
              <select value={typecat} onChange={(e)=>{
                setTypecat(e.target.value)
              
              }}  className='bg-gray-600 rounded-lg text-white h-10 focus:border-b-black w-52 '>
                  <option value={0}>SELECT A TYPE : </option>
                  <option value={'FOOD'}>FOOD</option>
                  <option value={'DRINK'}>DRINK</option>
              </select>
            </div>

            {shopdata?(
              <div>
              <button onClick={AddCategories}  className={buttonupdate?"hidden":"ml-9 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"}>
                Submit
              </button>
              <button onClick={UpdateCategories}  className={buttonupdate?"ml-9 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full":"hidden"}>
                Update
              </button>
              </div>
            ):(
                <p></p>
            )}
            


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
                          DESCRIPTION
                        </th>
                        <th
                          scope="col"
                          className="border-r px-6 py-4 dark:border-neutral-500">
                          TYPE
                        </th>
                        <th
                          scope="col"
                          className="border-r px-6 py-4 dark:border-neutral-500">
                          UPDATE
                        </th>
                        <th scope="col" className="px-6 py-4">DELETE</th>
                      </tr>
                    </thead>
                    <tbody>

                      {getallcategories && getallcategories.map((val,index)=>(
                              <tr className="border-b dark:border-neutral-500" key={index}>
                              <td
                                className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                {index}
                              </td>
                              <td
                                className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                                {val.category}
                              </td>
                              <td
                                className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                                {val.type}
                              </td>
                              <td
                                className="whitespace-nowrap border-r px-6 py-4 dark:border-neutral-500">
                                  <p onClick={()=>{
                                    setButtonupdate(true)
                                    setGetindex(index)
                                    setCategory(val.category)
                                    setTypecat(val.type)
                                    }} className='p-1 bg-green-800 rounded-md cursor-pointer'>Update</p>
                                
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                              <p onClick={()=>{
                                setGetindex(index)
                                DeleteCategory()
                              }} className='p-1 bg-red-800 rounded-md cursor-pointer'>Delete</p>
                              </td>
                            </tr>
                      ))}
                      
                      
                      
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

export default Categories