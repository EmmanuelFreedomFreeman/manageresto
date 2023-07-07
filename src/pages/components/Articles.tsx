import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { addDoc, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../../../firebase'

function Articles() {
  const { data: session } = useSession()
  const [buttonupdate, setButtonupdate] = useState(false)
  const [hidebutton, setHidebutton] = useState(false)
  const [getindex, setGetindex] = useState(Number)
  const [image, setImage] = useState('')
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [prix, setPrix] = useState(Number)
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);

  // Format the price above to USD using the locale, style, and currency.
  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // function add item
  const AddItem = async () => {
      const ItemObject = {
        image : image,
        name : nom,
        description : description,
        amount : prix,
        category: category

      }

      if (session?.user?.email) {

        // INSERT Item
       
        await setDoc(doc(db, session?.user?.email, "ITEMS"), {
          items: [...items,ItemObject],
        }).then(()=>{
          setImage('')
          setNom('')
          setDescription('')
          setPrix(Number)
          setCategory('')
          alert('data has been submited')
          setHidebutton(false)
        }).catch((error) => {
          alert(`Unsuccessful returned error ${error}`)});
        
      }




  }

  // function delete items

  const DeleteItem = async () => {
    const arr = [...items]
    
    arr.splice(getindex,1)
    if (session?.user?.email) {
      // UPDATE CATEGORY
      await setDoc(doc(db, session?.user?.email, "ITEMS"), {
        items: arr,
      }).then(()=>{
        setGetindex(Number)
        alert('data has been deleted')
      }).catch((error) => {
        alert(`Unsuccessful returned error ${error}`)});
      
    }

  }

  // function update items
  const UpdateItem = async () => {

    const ItemObject = {
      image : image,
      name : nom,
      description : description,
      amount : prix,
      category: category

    }

    
    const arr = [...items]
    arr[getindex] = ItemObject
    if (session?.user?.email) {
      // UPDATE CATEGORY
      await setDoc(doc(db, session?.user?.email, "ITEMS"), {
        items: arr,
      }).then(()=>{
        setImage('')
        setNom('')
        setDescription('')
        setPrix(0)
        setCategory('')
        setGetindex(Number)
        alert('data has been updated')
        setButtonupdate(false)
        setHidebutton(false)
      }).catch((error) => {
        alert(`Unsuccessful returned error ${error}`)});
      
    }


  }

  // INITIAL HOOKS

  useEffect(() => {

    if (session?.user?.email) {
      // initial categories
      const unsubCategories = onSnapshot(doc(db, session?.user?.email, "CATEGORIES"), (doc:any) => {
        doc.data()?.category? setCategories([...doc.data()?.category]):null
      });
      // initial items
      const unsubItems = onSnapshot(doc(db, session?.user?.email, "ITEMS"), (doc:any) => {
        doc.data()?.items? setItems([...doc.data().items]):''
      });
      
    }

    
   
  }, [])

  return (
    <div className='pr-4'>
      <p className='font-bold underline text-2xl text-center'>ARTICLE</p>
      <div className='flex justify-start mr-3'>
        <div className='mb-6'>
            <div className='flex justify-start pl-3 mt-4'>
              <p className='mr-3 pt-2'>URL IMAGE </p>
              <input type='text' value={image} onChange={(e)=>{
                setImage(e.target.value)
              }} className='ml-4 bg-gray-600 rounded-lg text-white h-10 focus:border-b-black ' />
            </div>
            <div className='flex justify-start pl-3 mt-4'>
              <p className='mr-3 pt-2'>ITEM NAME </p>
              <input type='text' value={nom} onChange={(e)=>{
                setNom(e.target.value)
              }} className='ml-3 bg-gray-600 rounded-lg text-white h-10 focus:border-b-black ' />
            </div>
            <div className='flex justify-start pl-3 mt-4'>
              <p className='mr-3 pt-2'>DESCRIPTION </p>
              
              <textarea value={description} onChange={(e)=>{
                setDescription(e.target.value)
              }} id="message" className="bg-gray-600 rounded-lg text-white h-10 focus:border-b-black " placeholder="Write your thoughts here..."></textarea>

            </div>
            <div className='flex justify-start pl-3 mt-4'>
              <p className='mr-3 pt-2'>AMOUNT/FC </p>
              <input type='number' value={prix} onChange={(e)=>{
                setPrix(parseFloat(e.target.value))
              }} className='ml-1 bg-gray-600 rounded-lg text-white h-10 focus:border-b-black ' />
            </div>
            <div className='flex justify-start pl-3 mt-4'>
              <p className='mr-3 pt-2'>CATEGORY </p>
              <select value={category} onChange={(e)=>{
                setCategory(e.target.value)
              }} className='ml-4 bg-gray-600 rounded-lg text-white h-10 focus:border-b-black w-52 '>
                
                <option>select a category</option>
                {categories? (
                    categories.map((val,index)=>(
                      <option value={val.category} key={index}>{val.category}</option>
                    ))
                ):(
                    <option value="null"></option>
                )}

              </select>
            </div>
            {categories.length>0 && (
              <div className={hidebutton?'hidden':''}>
              <button onClick={()=>{
                AddItem()
                setHidebutton(true)
                }}  className={buttonupdate?"hidden":"ml-3 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"}>
                Submit
              </button>
              <button onClick={()=>{
                UpdateItem()
                setHidebutton(true)
                }}  className={buttonupdate?"ml-3 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full":"hidden"}>
                Update
              </button>
              </div>
            )}
            


        </div>

                 {/* start table */}

        <div className="h-96 overflow-y-auto">

                  <table
                    className=" border text-center text-sm font-light dark:border-neutral-500">
                    <thead className="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th
                          scope="col"
                          className="border-r  dark:border-neutral-500">
                          #
                        </th>
                        <th
                          scope="col"
                          className="border-r  dark:border-neutral-500">
                          IMAGE
                        </th>
                        <th
                          scope="col"
                          className="border-r  dark:border-neutral-500">
                          ITEM NAME
                        </th>
                        <th
                          scope="col"
                          className="border-r w-10 dark:border-neutral-500">
                          DESCRIPTION
                        </th>
                        <th
                          scope="col"
                          className="border-r  dark:border-neutral-500">
                          AMOUNT
                        </th>
                        <th
                          scope="col"
                          className="border-r  dark:border-neutral-500">
                          CATEGORY
                        </th>
                        <th
                          scope="col"
                          className="border-r px-1 py-1 dark:border-neutral-500">
                          UPDATE
                        </th>
                        <th scope="col" className="px-1 py-1">DELETE</th>
            
                      </tr>
                    </thead>
                    <tbody>

                      {items.length>0 && (
                        items.map((val,index)=>(
                            <tr className="border-b dark:border-neutral-500" key={index}>
                            <td
                              className="border-r px-2 py-2 font-medium dark:border-neutral-500">
                              {index}
                            </td>
                            <td
                              className="border-r  dark:border-neutral-500">
                              <img className='w-20 h-20 rounded-full' src={val.image} alt='picture' />
                            </td>
                            <td className="border-r  dark:border-neutral-500">
                            {val.name}
                            </td>
                            <td className="border-r dark:border-neutral-500">
                            <p className='w-64 p-1'>{val.description}</p>
                            </td>
                            <td className="border-r  dark:border-neutral-500">
                            {new Intl.NumberFormat('en-US').format(val.amount)} FC
                            </td>
                            <td className="border-r  dark:border-neutral-500">
                            {val.category}
                            </td>
                            <td className="border-r dark:border-neutral-500">
                            <p onClick={()=>{
                                setButtonupdate(true)
                                setGetindex(index)
                                setImage(val.image)
                                setNom(val.name)
                                setDescription(val.description)
                                setPrix(val.amount)
                                setCategory(val.category)
                              }} className='p-1 bg-green-800 rounded-md cursor-pointer'>Update</p>
                            </td>
                            <td className="whitespace-nowrap">
                            <p onClick={()=>{
                                setGetindex(index)
                                DeleteItem()
                              }} className='p-1 bg-red-800 rounded-md cursor-pointer'>Delete</p>
                            </td>
                            
                          </tr>
                        ))
                      )}
                      
                      
                      
                    </tbody>
                  </table>
                
          </div>

        {/* end table */}

      </div>
    </div>
  )
}

export default Articles